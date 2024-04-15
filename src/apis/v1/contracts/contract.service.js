import SqlString from "sqlstring";
import { pool } from "../../../database/index.js";
import { APIError } from "../../../utils/index.js";

class ContractService {
  table = "contracts";
  primaryKey1 = "contract_id";
  primaryKey2 = "concern_id";
  primaryKey3 = "hotel_id";

  create({ concern_id, hotel_id, date_start, date_end }) {
    return new Promise(async (resolve, reject) => {
      try {
        const findCoopereate = await this.getById(concern_id, hotel_id);

        if (findCoopereate) {
          return reject(new APIError(400, "Contract was exist!"));
        }

        const sql = SqlString.format("INSERT INTO ?? SET ?", [
          this.table,
          { concern_id, hotel_id, date_start, date_end },
        ]);

        await pool.query(sql);

        resolve(await this.getById(concern_id, hotel_id));
      } catch (error) {
        reject(error);
      }
    });
  }

  getById(concernId, hotelId) {
    return new Promise(async (resolve, reject) => {
      try {
        const q = SqlString.format("SELECT * FROM ?? WHERE ??=? AND ??=?", [
          this.table,
          this.primaryKey2, // concern_id
          concernId,
          this.primaryKey3, // hotel_id
          hotelId,
        ]);
        const [result] = await pool.query(q);
        resolve(result[0]);
      } catch (error) {
        reject(error);
      }
    });
  }

  getAll(filters) {
    return new Promise(async (resolve, reject) => {
      try {
        const page = +filters?.page || 1;
        const limit = +filters?.limit || 5;
        const offset = limit * (page - 1);
        const search = filters?.search;
        const order = filters?.order; // hotel_name,desc

        const qJoin =
          "SELECT h.hotel_name, x.concern_name, created_at FROM ?? c JOIN hotels h ON c.hotel_id = h.hotel_id JOIN concerns x ON c.concern_id = x.concern_id";

        let q = SqlString.format(qJoin + " LIMIT ? OFFSET ?", [
          this.table,
          limit,
          offset,
        ]);

        let qTotalRow = SqlString.format(
          "SELECT count(*) as totalRow FROM ??",
          [this.table]
        );

        if (search && !order) {
          q = SqlString.format(
            qJoin + " WHERE h.hotel_name LIKE ? LIMIT ? OFFSET ?",
            [this.table, `%${search}%`, limit, offset]
          );
        } else if (order && !search) {
          const orderBy = order.split(",").join(" "); // => [hotel_name, desc]; => ? hotel_name desc : hotel_name

          q = SqlString.format(
            qJoin + " ORDER BY " + orderBy + " LIMIT ? OFFSET ?",
            [this.table, limit, offset]
          );
        } else if (search && order) {
          const orderBy = order.split(",").join(" ");

          q = SqlString.format(
            qJoin +
              " WHERE h.hotel_name LIKE ? ORDER BY " +
              orderBy +
              " LIMIT ? OFFSET ?",
            [this.table, `%${search}%`, limit, offset]
          );
        }

        const [result] = await pool.query(q);
        const [totalRow] = await pool.query(qTotalRow);

        resolve({
          result,
          paginations: {
            page,
            limit,
            totalPage: Math.ceil(totalRow[0].totalRow / limit),
          },
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  deleteById(contractId, concernId, hotelId) {
    return new Promise(async (resolve, reject) => {
      try {
        const q = SqlString.format(
          "DELETE FROM ?? WHERE ??=? AND ??=? AND ??=?",
          [
            this.table,
            this.primaryKey1, // contract_id
            contractId,
            this.primaryKey2, // concern_id
            concernId,
            this.primaryKey3, // hotel_id
            hotelId,
          ]
        );
        const [result] = await pool.query(q);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  delete() {
    return new Promise(async (resolve, reject) => {
      try {
        const q = SqlString.format("DELETE FROM ??", [this.table]);
        const [result] = await pool.query(q);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default new ContractService();
