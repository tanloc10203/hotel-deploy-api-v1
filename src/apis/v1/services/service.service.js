import SqlString from "sqlstring";
import { pool } from "../../../database/index.js";
import { APIError } from "../../../utils/index.js";

class ServiceHotelService {
  table = "services";
  primaryKey = "service_id";
  select = [
    "service_id",
    "service_name",
    "service_desc",
    "service_price",
    "hotel_name",
  ];

  create(data = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        let sql = SqlString.format(
          "SELECT ?? FROM ?? WHERE service_name = ? and hotel_id = ?",
          [this.primaryKey, this.table, data.service_name, data.hotel_id]
        );

        const [findService] = await pool.query(sql);

        if (findService?.length > 0) {
          return reject(
            new APIError(400, "Serivce name or hote id was exist!")
          );
        }

        sql = SqlString.format("INSERT INTO ?? SET ?", [this.table, data]);

        const [result] = await pool.query(sql);

        const id = result.insertId;

        resolve(await this.getById(id));
      } catch (error) {
        reject(error);
      }
    });
  }

  update(id, data) {
    return new Promise(async (resolve, reject) => {
      try {
        const q = SqlString.format("UPDATE ?? SET ? WHERE ?? = ?", [
          this.table,
          data,
          this.primaryKey,
          id,
        ]);
        const [result] = await pool.query(q);

        if (result.affectedRows === 0) {
          return reject(
            new APIError(
              404,
              "Cannot update because customer id was not found!"
            )
          );
        }

        resolve(await this.getById(id));
      } catch (error) {
        reject(error);
      }
    });
  }

  getById(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const q = SqlString.format(
          "SELECT ?? FROM ?? s JOIN hotels h ON s.hotel_id = h.hotel_id WHERE ??=?",
          [this.select, this.table, this.primaryKey, id]
        );
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

        let q = SqlString.format(
          "SELECT ?? FROM ?? e JOIN hotels h ON e.hotel_id = h.hotel_id LIMIT ? OFFSET ?",
          [this.select, this.table, limit, offset]
        );

        let qTotalRow = SqlString.format(
          "SELECT count(*) as totalRow FROM ?? e JOIN hotels h ON e.hotel_id = h.hotel_id",
          [this.table]
        );

        if (search && !order) {
          q = SqlString.format(
            "SELECT ?? FROM ?? e JOIN hotels h ON e.hotel_id = h.hotel_id WHERE service_name LIKE ? LIMIT ? OFFSET ?",
            [this.select, this.table, `%${search}%`, limit, offset]
          );
        } else if (order && !search) {
          const orderBy = order.split(",").join(" "); // => [hotel_name, desc]; => ? hotel_name desc : hotel_name

          q = SqlString.format(
            "SELECT ?? FROM ?? e JOIN hotels h ON e.hotel_id = h.hotel_id ORDER BY " +
              orderBy +
              " LIMIT ? OFFSET ?",
            [this.select, this.table, limit, offset]
          );
        } else if (search && order) {
          const orderBy = order.split(",").join(" ");

          q = SqlString.format(
            "SELECT ?? FROM ?? e JOIN hotels h ON e.hotel_id = h.hotel_id WHERE service_name LIKE ? ORDER BY " +
              orderBy +
              " LIMIT ? OFFSET ?",
            [this.select, this.table, `%${search}%`, limit, offset]
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

  deleteById(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const q = SqlString.format("DELETE FROM ?? WHERE ??=?", [
          this.table,
          this.primaryKey,
          id,
        ]);
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

export default new ServiceHotelService();
