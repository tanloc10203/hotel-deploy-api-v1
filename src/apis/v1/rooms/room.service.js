import SqlString from "sqlstring";
import { pool } from "../../../database/index.js";
import createUUID from "../../../utils/genaralUuid.js";
import { APIError } from "../../../utils/index.js";
import { cloudinaryV2 } from "../../../utils/upload.util.js";
import { roles } from "../auth/auth.service.js";
import roomImageService from "../room-images/room-image.service.js";
import roomPriceService from "../room-prices/room-price.service.js";

const sqlSwitch = {
  qLimitAndOffset: {
    ADMIN: {
      sql: "SELECT r.*, hotel_name, rt_name, value as status, floor_name, price, percent_discount FROM `rooms` r JOIN room_prices rp ON r.room_id = rp.room_id JOIN floors f ON r.floor_id = f.floor_id JOIN statuses s ON r.status_id = s.status_id JOIN hotels h ON r.hotel_id = h.hotel_id JOIN room_types rt ON r.rt_id = rt.rt_id LIMIT ? OFFSET ?",
    },
    HOTEL: {
      sql: "SELECT r.*, hotel_name, rt_name, value as status, floor_name, price, percent_discount FROM `rooms` r JOIN room_prices rp ON r.room_id = rp.room_id JOIN floors f ON r.floor_id = f.floor_id JOIN statuses s ON r.status_id = s.status_id JOIN hotels h ON r.hotel_id = h.hotel_id JOIN room_types rt ON r.rt_id = rt.rt_id WHERE h.owner_id=? LIMIT ? OFFSET ?",
    },
  },
  qTotalRow: {
    ADMIN: {
      sql: "SELECT count(*) as totalRow FROM ??",
    },
    HOTEL: {
      sql: "SELECT count(*) as totalRow FROM ?? r JOIN hotels h ON h.owner_id=? AND r.hotel_id=h.hotel_id",
    },
  },
  qSearch: {
    ADMIN: {
      sql: "SELECT r.*, hotel_name, rt_name, value as status, floor_name, price, percent_discount FROM `rooms` r JOIN room_prices rp ON r.room_id = rp.room_id JOIN floors f ON r.floor_id = f.floor_id JOIN statuses s ON r.status_id = s.status_id JOIN hotels h ON r.hotel_id = h.hotel_id JOIN room_types rt ON r.rt_id = rt.rt_id WHERE room_name LIKE ? LIMIT ? OFFSET ?",
    },
    HOTEL: {
      sql: "SELECT r.*, hotel_name, rt_name, value as status, floor_name, price, percent_discount FROM `rooms` r JOIN hotels h ON h.owner=? AND r.hotel_id = h.hotel_id JOIN room_prices rp ON r.room_id = rp.room_id JOIN floors f ON r.floor_id = f.floor_id JOIN statuses s ON r.status_id = s.status_id JOIN room_types rt ON r.rt_id = rt.rt_id WHERE room_name LIKE ? LIMIT ? OFFSET ?",
    },
  },
  qOrder: {
    ADMIN: {
      sql: "SELECT r.*, hotel_name, rt_name, value as status, floor_name, price, percent_discount FROM `rooms` r JOIN room_prices rp ON r.room_id = rp.room_id JOIN floors f ON r.floor_id = f.floor_id JOIN statuses s ON r.status_id = s.status_id JOIN hotels h ON r.hotel_id = h.hotel_id JOIN room_types rt ON r.rt_id = rt.rt_id ORDER BY ",
    },
    HOTEL: {
      sql: "SELECT r.*, hotel_name, rt_name, value as status, floor_name, price, percent_discount FROM `rooms` r JOIN hotels h ON h.owner_id=? AND r.hotel_id = h.hotel_id JOIN room_prices rp ON r.room_id = rp.room_id JOIN floors f ON r.floor_id = f.floor_id JOIN statuses s ON r.status_id = s.status_id  JOIN room_types rt ON r.rt_id = rt.rt_id ORDER BY ",
    },
  },
  qSearchAndOrder: {
    ADMIN: {
      sql: "SELECT r.*, hotel_name, rt_name, value as status, floor_name, price, percent_discount FROM `rooms` r JOIN room_prices rp ON r.room_id = rp.room_id JOIN floors f ON r.floor_id = f.floor_id JOIN statuses s ON r.status_id = s.status_id JOIN hotels h ON r.hotel_id = h.hotel_id JOIN room_types rt ON r.rt_id = rt.rt_id WHERE room_name LIKE ? ORDER BY ",
    },
    HOTEL: {
      sql: "SELECT r.*, hotel_name, rt_name, value as status, floor_name, price, percent_discount FROM `rooms` r JOIN hotels h ON h.owner_id=? AND r.hotel_id = h.hotel_id JOIN room_prices rp ON r.room_id = rp.room_id JOIN floors f ON r.floor_id = f.floor_id JOIN statuses s ON r.status_id = s.status_id JOIN room_types rt ON r.rt_id = rt.rt_id WHERE room_name LIKE ? ORDER BY ",
    },
  },
};

class RoomService {
  table = "rooms";
  primaryKey1 = "room_id";
  primaryKey2 = "floor_id";
  select = [
    "room_id",
    "room_name",
    "room_desc",
    "room_thumb",
    "hotel_name",
    "floor_name",
    "rt_name",
    "avaiable",
  ];

  create(data = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        let {
          room_thumb,
          r_image_value,
          price,
          discount,
          percent_discount,
          ...others
        } = data;
        let sql = SqlString.format(
          "SELECT ?? FROM ?? WHERE floor_id = ? and room_name = ? and hotel_id = ?",
          [
            this.primaryKey1,
            this.table,
            others.floor_id,
            others.room_name,
            others.hotel_id,
          ]
        );

        const [findRoom] = await pool.query(sql);

        if (findRoom?.length > 0) {
          return reject(
            new APIError(400, "Floor and room name was exist in the hotel!")
          );
        }

        /**
         * Đầu tiên thì mình phải lưu ảnh cái phòng.
         */
        sql = SqlString.format("INSERT INTO ?? SET ?", [
          this.table,
          {
            ...others,
            room_thumb: room_thumb[0].path,
            file_name_img: room_thumb[0].filename,
          },
        ]);

        await pool.query(sql);

        /**
         * Sau khi tao phòng thành công thì lúc này
         * Tạo danh sách ảnh của phòng
         * listImgs[] = [id, room_id, value, filename]
         */
        const listImgs = r_image_value.map((img) => [
          createUUID(),
          others.room_id,
          img.path,
          img.filename,
        ]);

        await roomImageService.create(listImgs);

        /**
         * Lưu lại giá của phòng sau khi đã thực hiện các bước trên
         */

        const dataPrice = {
          floor_id: others.floor_id,
          room_id: others.room_id,
          price: price,
          discount: discount === "true" ? 1 : 0,
          percent_discount: percent_discount,
        };

        await roomPriceService.create(dataPrice);

        resolve(await this.getById(others.room_id));
      } catch (error) {
        console.log("error:::", error);
        reject(error);
      }
    });
  }

  update(id, data) {
    return new Promise(async (resolve, reject) => {
      try {
        let {
          room_thumb,
          r_image_value,
          img_delete,
          discount,
          percent_discount,
          price,
          date_time,
          ...others
        } = data;

        /**
         * Nếu tồn tại room_thumb
         * Thì xoá ảnh cũ trên cloudinary
         * Xong rồi cập nhật lại ảnh mới vào table rooms.
         * file_name_img là data được truyền lên
         */

        if (room_thumb && room_thumb.length > 0) {
          await cloudinaryV2.uploader.destroy(others.file_name_img);

          others = {
            ...others,
            room_thumb: room_thumb[0].path,
            file_name_img: room_thumb[0].filename,
          };
        }

        let q = SqlString.format("UPDATE ?? SET ? WHERE ?? = ?", [
          this.table,
          others,
          this.primaryKey1,
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

        /**
         * Nếu tồn tại img_delete[] thì xoá ảnh trong database => table room_images.
         * Đồng thời xoá ảnh trên cloudinary.
         */
        if (img_delete && img_delete.length > 0) {
          const imgs_id = [...img_delete].map((i) => i.id);

          await Promise.all(
            img_delete.map((i) => cloudinaryV2.uploader.destroy(i.file_name))
          );

          q = SqlString.format(
            "DELETE FROM `room_images` WHERE r_image_id IN (?)",
            [imgs_id]
          );

          await pool.query(q);
        }

        /**
         * Nếu tồn tại r_image_value[] thì
         * Đây là mảng được thêm vào.
         * Trường r_image_value cũng được thêm vào khi tạo rooms
         * Thêm mới ảnh vào database => table room_images.
         * tạo ra 1 mảng listImgs[] = [[id, room_id, value, filename]]
         */
        if (r_image_value && r_image_value.length > 0) {
          const listImgs = r_image_value.map((img) => [
            createUUID(),
            id,
            img.path,
            img.filename,
          ]);

          await roomImageService.create(listImgs);
        }

        const dataPrice = {
          price: price,
          discount: discount === "true" ? 1 : 0,
          percent_discount: discount === "false" ? 0 : percent_discount,
        };

        await roomPriceService.update(
          { floorId: others.floor_id, roomId: others.room_id },
          dataPrice
        );

        resolve(await this.getById(id));
      } catch (error) {
        reject(error);
      }
    });
  }

  getById(id) {
    return new Promise(async (resolve, reject) => {
      try {
        let q = SqlString.format("SELECT * FROM ?? WHERE ??=?", [
          this.table,
          this.primaryKey1,
          id,
        ]);

        const [result] = await pool.query(q);

        if (!result.length) {
          return reject(new APIError(404, "Get by id not found"));
        }

        q = SqlString.format("SELECT * FROM ?? WHERE ??=?", [
          "room_images",
          "room_id",
          id,
        ]);

        const [images] = await pool.query(q);

        q = SqlString.format("SELECT * FROM ?? WHERE ??=?", [
          "room_prices",
          "room_id",
          id,
        ]);

        const [price] = await pool.query(q);

        resolve({
          ...result[0],
          images: [...images],
          ...price[0],
          discount: Number(price[0].discount) === 1 ? true : false,
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  getAll(filters, user = { role: "ADMIN" }) {
    return new Promise(async (resolve, reject) => {
      try {
        const page = +filters?.page || 1;
        const limit = +filters?.limit || 5;
        const offset = limit * (page - 1);
        const search = filters?.search;
        const order = filters?.order; // hotel_name,desc

        // * dependency query limit and offset
        const dqLAO =
          user.role === roles.ADMIN
            ? [limit, offset]
            : [user.user_id, limit, offset];

        let q = SqlString.format(
          sqlSwitch.qLimitAndOffset[user.role].sql,
          dqLAO
        );

        // * dependency query total row.
        const dqTR =
          user.role === roles.ADMIN ? [this.table] : [this.table, user.user_id];

        let qTotalRow = SqlString.format(
          sqlSwitch.qTotalRow[user.role].sql,
          dqTR
        );

        if (search && !order) {
          // * dependency query search;
          const dqS =
            user.role === roles.ADMIN
              ? [`%${search}%`, limit, offset]
              : [user.user_id, `%${search}%`, limit, offset];

          q = SqlString.format(sqlSwitch.qSearch[user.role].sql, dqS);
        } else if (order && !search) {
          // * dependency query search;
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
          // * dependency query search;
          const dqSAO =
            user.role === roles.ADMIN
              ? [`%${search}%`, limit, offset]
              : [user.user_id, `%${search}%`, limit, offset];
          const orderBy = order.split(",").join(" ");

          q = SqlString.format(
            sqlSwitch.qSearchAndOrder[user.role].sql +
              orderBy +
              " LIMIT ? OFFSET ?",
            dqSAO
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
        /**
         * - Trước khi xoá hotel thì phải select by id
         * - Để có thể lấy danh sách ảnh của hotel này
         * và để xoá ảnh trên cloudinary.
         * - Vì để xoá được ảnh trên cloudinary thì
         * bắt buộc phải có filename.
         */
        const response = await this.getById(id);

        await Promise.all(
          response.images.map((i) => cloudinaryV2.uploader.destroy(i.file_name))
        );

        /**
         * Sau đó mình sẽ xoá ảnh tiêu đề của khách sạn
         * trên cloudinary.
         */

        await cloudinaryV2.uploader.destroy(response.file_name_img);

        const q = SqlString.format("DELETE FROM ?? WHERE ??=?", [
          this.table,
          this.primaryKey1,
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

export default new RoomService();
