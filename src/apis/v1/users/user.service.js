import SqlString from "sqlstring";
import DBModel from "../../../database/DBModel.js";
import { pool } from "../../../database/index.js";
import { APIError, hashPassword } from "../../../utils/index.js";
import { cloudinaryV2 } from "../../../utils/upload.util.js";

class UserService extends DBModel {
  table = "users";
  primaryKey = "user_id";
  select = [
    "user_id",
    "first_name",
    "last_name",
    "email",
    "username",
    "phone",
    "identity_card",
    "year_of_brith",
    "role",
    "address",
    "picture",
    "file_name_picture",
  ];

  create(data = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        let sql = SqlString.format(
          "SELECT ?? FROM ?? WHERE email = ? or phone = ? or username = ?",
          [this.primaryKey, this.table, data.email, data.phone, data.username]
        );

        const [findEmp] = await pool.query(sql);

        if (findEmp?.length > 0) {
          return reject(
            new APIError(
              400,
              "E-mail hoặc tài khoản hoặc số điện thoại đã tồn tại!"
            )
          );
        }

        const password = await hashPassword(data.password);

        sql = SqlString.format("INSERT INTO ?? SET ?", [
          this.table,
          { ...data, password },
        ]);

        const [result] = await pool.query(sql);

        resolve(await this.getById(data.user_id));
      } catch (error) {
        reject(error);
      }
    });
  }

  update(id, data) {
    return new Promise(async (resolve, reject) => {
      try {
        /**
         * Tồn tại picture thì xóa ảnh cũ rồi cập nhật lại
         */

        let dataUpdate = {
          ...data,
        };

        if (data.picture) {
          if (data?.file_name_picture) {
            try {
              await cloudinaryV2.uploader.destroy(
                data?.file_name_picture || ""
              );
            } catch (error) {
              console.log("error delete image:::", error);
            }
          }
          dataUpdate = {
            picture: data.picture.filename,
            file_name_picture: data.picture.path,
          };
        }

        const q = SqlString.format("UPDATE ?? SET ? WHERE ?? = ?", [
          this.table,
          dataUpdate,
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
        const response = await this.find({
          conditions: { [this.primaryKey]: id },
          select: this.select,
        });

        if (!response) {
          return reject(new APIError("404", `User id = ${id} not found!`));
        }

        resolve(response);
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

        let q = SqlString.format("SELECT ?? FROM ?? LIMIT ? OFFSET ?", [
          this.select,
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
            "SELECT ?? FROM ?? WHERE last_name LIKE ? LIMIT ? OFFSET ?",
            [this.select, this.table, `%${search}%`, limit, offset]
          );
        } else if (order && !search) {
          const orderBy = order.split(",").join(" "); // => [hotel_name, desc]; => ? hotel_name desc : hotel_name

          q = SqlString.format(
            "SELECT ?? FROM ?? ORDER BY " + orderBy + " LIMIT ? OFFSET ?",
            [this.select, this.table, limit, offset]
          );
        } else if (search && order) {
          const orderBy = order.split(",").join(" ");

          q = SqlString.format(
            "SELECT ?? FROM ?? WHERE hotel_name LIKE ? ORDER BY " +
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

export default new UserService("users");
