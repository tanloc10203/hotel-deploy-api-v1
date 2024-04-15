import SqlString from "sqlstring";
import { pool } from "../../../database/index.js";
import { APIError } from "../../../utils/index.js";
import _ from "lodash";

class StatusService {
  table = "statuses";
  primaryKey = "status_id";

  create({ type, desc, key, value, status_id }) {
    return new Promise(async (resolve, reject) => {
      try {
        let sql = SqlString.format(
          "SELECT ?? FROM ?? WHERE `statuses`.key = ? or value = ?",
          [this.primaryKey, this.table, key, value]
        );

        const [find] = await pool.query(sql);

        if (find?.length > 0) {
          return reject(
            new APIError(400, "Tên hoặc giá trị của trạng thái đã tồn tại!")
          );
        }

        sql = SqlString.format("INSERT INTO ?? SET ?", [
          this.table,
          { type, desc, key, value, status_id },
        ]);

        const [result] = await pool.query(sql);

        resolve(await this.getById(status_id));
      } catch (error) {
        reject(error);
      }
    });
  }

  getById(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const q = SqlString.format("SELECT * FROM ?? WHERE ??=?", [
          this.table,
          this.primaryKey,
          id,
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
        const where = filters?.where?.split(","); // where=type,ABC
        let whereBy =
          where && where.length > 0
            ? {
                key: where[0],
                value: where[1],
              }
            : null;

        let q = SqlString.format("SELECT * FROM `statuses` LIMIT ? OFFSET ?", [
          limit,
          offset,
        ]);

        let qTotalRow = SqlString.format(
          "SELECT count(*) as totalRow FROM ??",
          [this.table]
        );

        if (search && !order) {
          q = SqlString.format(
            "SELECT * FROM `statuses` WHERE value LIKE ? LIMIT ? OFFSET ?",
            [`%${search}%`, limit, offset]
          );
        } else if (order && !search) {
          const orderBy = order.split(",").join(" "); // => [hotel_name, desc]; => ? hotel_name desc : hotel_name

          q = SqlString.format(
            "SELECT * FROM `statuses` ORDER BY " +
              orderBy +
              " LIMIT ? OFFSET ?",
            [limit, offset]
          );
        } else if (search && order) {
          const orderBy = order.split(",").join(" ");

          q = SqlString.format(
            "SELECT * FROM `statuses` WHERE value LIKE ? ORDER BY " +
              orderBy +
              " LIMIT ? OFFSET ?",
            [`%${search}%`, limit, offset]
          );
        } else if (!_.isEmpty(whereBy)) {
          q = SqlString.format("SELECT * FROM `statuses` WHERE ?? LIKE ? ", [
            whereBy.key,
            `%${whereBy.value}%`,
          ]);
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

export default new StatusService();
