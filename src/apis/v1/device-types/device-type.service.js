import SqlString from "sqlstring";
import { DBModel, pool } from "../../../database/index.js";
import { APIError } from "../../../utils/index.js";
import { roles } from "../auth/auth.service.js";

class DeviceTypeService {
  table = "device_types";
  primaryKey = "dt_id";
  select = ["dt_id", "dt_name", "dt_desc"];

  create(data = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        let sql = SqlString.format("SELECT ?? FROM ?? WHERE dt_name = ?", [
          this.primaryKey,
          this.table,
          data.dt_name,
        ]);

        const [findDT] = await pool.query(sql);

        if (findDT?.length > 0) {
          return reject(new APIError(400, "Device type name was exist!"));
        }

        sql = SqlString.format("INSERT INTO ?? SET ?", [this.table, data]);

        const [result] = await pool.query(sql);

        resolve(await this.getById(data.dt_id));
      } catch (error) {
        reject(error);
      }
    });
  }

  update(id, data, user = { role: "ADMIN" }) {
    return new Promise(async (resolve, reject) => {
      try {
        const DB = new DBModel("device_types");

        const deviceType = await DB.find({
          conditions: {
            dt_id: id,
          },
        });

        if (user.role === roles.HOTEL && deviceType?.user_id !== user.user_id) {
          return reject(
            new APIError(403, "Bạn không được phép chỉnh sửa thiết bị này.")
          );
        }

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
        const q = SqlString.format("SELECT ?? FROM ?? WHERE ??=?", [
          this.select,
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

        let q = SqlString.format(
          "SELECT d.*, first_name, last_name FROM `device_types` d JOIN users u ON d.user_id = u.user_id LIMIT ? OFFSET ?",
          [limit, offset]
        );

        let qTotalRow = SqlString.format(
          "SELECT count(*) as totalRow FROM ??",
          [this.table]
        );

        if (search && !order) {
          q = SqlString.format(
            "SELECT d.*, first_name, last_name FROM `device_types` d JOIN users u ON d.user_id = u.user_id WHERE dt_name LIKE ? LIMIT ? OFFSET ?",
            [`%${search}%`, limit, offset]
          );
        } else if (order && !search) {
          const orderBy = order.split(",").join(" "); // => [hotel_name, desc]; => ? hotel_name desc : hotel_name

          q = SqlString.format(
            "SELECT d.*, first_name, last_name FROM `device_types` d JOIN users u ON d.user_id = u.user_id ORDER BY " +
              orderBy +
              " LIMIT ? OFFSET ?",
            [limit, offset]
          );
        } else if (search && order) {
          const orderBy = order.split(",").join(" ");

          q = SqlString.format(
            "SELECT d.*, first_name, last_name FROM `device_types` d JOIN users u ON d.user_id = u.user_id WHERE dt_name LIKE ? ORDER BY " +
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

  deleteById(id, user = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        const DB = new DBModel("device_types");

        const deviceType = await DB.find({
          conditions: {
            dt_id: id,
          },
        });

        if (user.role === roles.HOTEL && deviceType?.user_id !== user.user_id) {
          return reject(
            new APIError(403, "Bạn không được phép xóa thiết bị này.")
          );
        }

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

export default new DeviceTypeService();
