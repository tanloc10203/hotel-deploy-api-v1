import SqlString from "sqlstring";
import { pool } from "../../../database/index.js";
import { APIError } from "../../../utils/index.js";

class RegisterService {
  table = "registers";
  primaryKey1 = "hotel_id";
  primaryKey2 = "customer_id";

  create({ hotel_id, customer_id }) {
    return new Promise(async (resolve, reject) => {
      try {
        const find = await this.getById(customer_id, hotel_id);

        if (find) {
          return reject(new APIError(400, "Register was exist!"));
        }

        const sql = SqlString.format("INSERT INTO ?? SET ?", [
          this.table,
          { hotel_id, customer_id },
        ]);

        await pool.query(sql);

        resolve(await this.getById(customer_id, hotel_id));
      } catch (error) {
        reject(error);
      }
    });
  }

  getById(customerId, hotelId) {
    return new Promise(async (resolve, reject) => {
      try {
        const q = SqlString.format("SELECT * FROM ?? WHERE ??=? AND ??=?", [
          this.table,
          this.primaryKey1, // hotel_id
          hotelId,
          this.primaryKey2, // customer_id
          customerId,
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

        // SELECT hotel_name, first_name, last_name, created_at as register_at FROM `registers` r JOIN hotels h ON r.hotel_id = h.hotel_id JOIN customers c ON r.customer_id = c.customer_id;

        const qJoin =
          "SELECT hotel_name, first_name, last_name, created_at as register_at FROM `registers` r JOIN hotels h ON r.hotel_id = h.hotel_id JOIN customers c ON r.customer_id = c.customer_id";

        let q = SqlString.format(qJoin + " LIMIT ? OFFSET ?", [limit, offset]);

        let qTotalRow = SqlString.format(
          "SELECT count(*) as totalRow FROM ??",
          [this.table]
        );

        if (search && !order) {
          q = SqlString.format(
            qJoin + " WHERE h.hotel_name LIKE ? LIMIT ? OFFSET ?",
            [`%${search}%`, limit, offset]
          );
        } else if (order && !search) {
          const orderBy = order.split(",").join(" "); // => [hotel_name, desc]; => ? hotel_name desc : hotel_name

          q = SqlString.format(
            qJoin + " ORDER BY " + orderBy + " LIMIT ? OFFSET ?",
            [limit, offset]
          );
        } else if (search && order) {
          const orderBy = order.split(",").join(" ");

          q = SqlString.format(
            qJoin +
              " WHERE h.hotel_name LIKE ? ORDER BY " +
              orderBy +
              " LIMIT ? OFFSET ?",
            [`%${search}%`, limit, offset]
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

  deleteById(customerId, hotelId) {
    return new Promise(async (resolve, reject) => {
      try {
        const q = SqlString.format("DELETE FROM ?? WHERE ??=? AND ??=?", [
          this.table,
          this.primaryKey1, // hotel_id
          hotelId,
          this.primaryKey2, // customer_id
          customerId,
        ]);
        const [result] = await pool.query(q);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default new RegisterService();
