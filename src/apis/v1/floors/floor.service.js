import SqlString from "sqlstring";
import { pool } from "../../../database/index.js";
import { APIError } from "../../../utils/index.js";
import _ from "lodash";
import { roles } from "../auth/auth.service.js";

const sqlSwitch = {
  qLimitAndOffset: {
    ADMIN: {
      sql: "SELECT f.*, hotel_name FROM `floors` f JOIN hotels h ON f.hotel_id = h.hotel_id LIMIT ? OFFSET ?",
    },
    HOTEL: {
      sql: "SELECT f.*, hotel_name FROM `floors` f JOIN hotels h ON f.hotel_id = h.hotel_id JOIN users u ON h.owner_id = user_id WHERE h.owner_id = ? LIMIT ? OFFSET ?",
    },
  },
  qTotalRow: {
    ADMIN: {
      sql: "SELECT count(*) as totalRow FROM ??",
    },
    HOTEL: {
      sql: "SELECT count(*) as totalRow FROM ?? f JOIN hotels h ON f.hotel_id = h.hotel_id JOIN users u ON h.owner_id = user_id WHERE h.owner_id=? ",
    },
  },
  qSearch: {
    ADMIN: {
      sql: "SELECT f.*, hotel_name FROM `floors` f JOIN hotels h ON f.hotel_id = h.hotel_id WHERE floor_name LIKE ? LIMIT ? OFFSET ? ",
    },
    HOTEL: {
      sql: "SELECT f.*, hotel_name FROM `floors` f JOIN hotels h ON f.hotel_id = h.hotel_id JOIN users u ON h.owner_id = u.user_id WHERE floor_name LIKE ? AND h.owner_id = ? LIMIT ? OFFSET ? ",
    },
  },
  qOrder: {
    ADMIN: {
      sql: "SELECT f.*, hotel_name FROM `floors` f JOIN hotels h ON f.hotel_id = h.hotel_id ORDER BY ",
    },
    HOTEL: {
      sql: "SELECT f.*, hotel_name FROM `floors` f JOIN hotels h ON f.hotel_id = h.hotel_id JOIN users u ON h.owner_id = u.user_id WHERE owner_id = ? ORDER BY ",
    },
  },
  qSearchAndOrder: {
    ADMIN: {
      sql: "SELECT f.*, hotel_name FROM `floors` f JOIN hotels h ON f.hotel_id = h.hotel_id WHERE floor_name LIKE ? ORDER BY ",
    },
    HOTEL: {
      sql: "SELECT f.*, hotel_name FROM `floors` f JOIN hotels h ON f.hotel_id = h.hotel_id JOIN users u ON h.owner_id = u.user_id WHERE floor_name LIKE ? AND owner_id = ? ORDER BY ",
    },
  },
};

class FloorService {
  table = "floors";
  primaryKey = "floor_id";

  create(data = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        let sql = SqlString.format(
          "SELECT ?? FROM ?? WHERE floor_name = ? AND hotel_id=?",
          [this.primaryKey, this.table, data.floor_name, data.hotel_id]
        );

        const [find] = await pool.query(sql);

        if (find?.length > 0) {
          return reject(new APIError(400, "Floor name was exist in Hotel!"));
        }

        sql = SqlString.format("INSERT INTO ?? SET ?", [this.table, data]);

        const [result] = await pool.query(sql);

        resolve(await this.getById(data.floor_id));
      } catch (error) {
        reject(error);
      }
    });
  }

  getById(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const q = SqlString.format(
          "SELECT f.*, hotel_name FROM `floors` f JOIN hotels h ON f.hotel_id = h.hotel_id WHERE ??=?",
          [this.primaryKey, id]
        );
        const [result] = await pool.query(q);
        resolve(result[0]);
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

  getAll(
    filters,
    user = {
      role: "ADMIN",
    }
  ) {
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

        // * dependency query limit and offset.
        const dQLAO =
          user.role === roles.ADMIN
            ? [limit, offset]
            : [user.user_id, limit, offset];

        // * dependency query total row.
        const dQTR =
          user.role === roles.ADMIN ? [this.table] : [this.table, user.user_id];

        let q = SqlString.format(
          sqlSwitch.qLimitAndOffset[user.role].sql,
          dQLAO
        );

        let qTotalRow = SqlString.format(
          sqlSwitch.qTotalRow[user.role].sql,
          dQTR
        );

        if (search && !order) {
          // * dependency query search and order;
          const dqS =
            user.role === roles.ADMIN
              ? [`%${search}%`, limit, offset]
              : [`%${search}%`, user.user_id, limit, offset];
          q = SqlString.format(sqlSwitch.qSearch[user.role].sql, dqS);
        } else if (order && !search) {
          // * dependency query order;
          const dqO =
            user.role === roles.ADMIN
              ? [limit, offset]
              : [user.user_id, limit, offset];

          const orderBy = order.split(",").join(" "); // => [hotel_name, desc]; => ? hotel_name desc : hotel_name

          q = SqlString.format(
            sqlSwitch.qOrder[user.role].sql + orderBy + " LIMIT ? OFFSET ?",
            dqO
          );
        } else if (search && order) {
          // * dependency query search and order;
          const dqSAO =
            user.role === roles.ADMIN
              ? [`%${search}%`, limit, offset]
              : [`%${search}%`, user.user_id, limit, offset];

          const orderBy = order.split(",").join(" ");

          q = SqlString.format(
            sqlSwitch.qSearchAndOrder[user.role].sql +
              orderBy +
              " LIMIT ? OFFSET ?",
            dqSAO
          );
        } else if (!_.isEmpty(whereBy)) {
          q = SqlString.format("SELECT * FROM `floors` WHERE ?? LIKE ? ", [
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

export default new FloorService();
