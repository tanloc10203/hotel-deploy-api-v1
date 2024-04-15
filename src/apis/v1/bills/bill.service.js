import _ from "lodash";
import SqlString from "sqlstring";
import DBModel from "../../../database/DBModel.js";
import { pool } from "../../../database/index.js";
import {
  APIError,
  billHTML,
  deleteKeyObjectOrNullOrUndefinedOrEmpty,
  getFieldOfObject,
} from "../../../utils/index.js";
import { roles } from "../auth/auth.service.js";
import EmailService from "../emails/email.service.js";

export const statuses = {
  UNPAID: {
    key: "UNPAID",
    value: "Khách hàng sẽ thanh toán trong kì nghỉ.",
    response: "Phòng này bạn đã đặt trước đó. Vui lòng kiểm tra lại!",
    transfrom: "STARTED_USE",
  },
  PAID: {
    key: "PAID",
    value: "Khách hàng đã thanh toán.",
    response: "Phòng này bạn đã đặt trước đó. Vui lòng kiểm tra lại!",
    transfrom: "STARTED_USE",
  },
  OTHER: {
    key: "OTHER",
    value: "Trạng thái không xác định!",
    response: "Lỗi không xác định. Vui lòng quay lại sau!",
    transfrom: "OTHER",
  },
  STARTED_USE: {
    key: "STARTED_USE",
    value: "Khách hàng đang sử dụng phòng.",
    response: "Phòng này bạn đang được sử dụng trong kỳ nghỉ của bạn!",
    transfrom: "ENDED_USE",
  },
  ENDED_USE: {
    key: "ENDED_USE",
    value: "Khách hàng đã kết thúc kì nghỉ.",
    transfrom: "ENDED_USE",
  },
  CANCEL: {
    key: "CANCEL",
    value: "Khách hàng đã huỷ đặt phòng",
    transfrom: "CANCEL",
  },
};

export const bookingFor = {
  ME: "ME",
  CUSTOMER: "CUSTOMER",
};

const sqlSwitch = {
  qLimitAndOffset: {
    ADMIN: {
      sql: "SELECT b.*, u.first_name, u.last_name, h.hotel_name, CURRENT_DATE() - DATE(b.created_at) as date_count_cancel FROM ?? b JOIN ?? u ON b.user_id = u.user_id JOIN bill_details bd ON bd.bill_id = b.bill_id JOIN rooms r ON r.room_id = bd.room_id JOIN hotels h ON r.hotel_id = h.hotel_id ORDER BY b.created_at DESC LIMIT ? OFFSET ? ",
    },
    HOTEL: {
      sql: "SELECT b.*, u.first_name, u.last_name, h.hotel_name, CURRENT_DATE() - DATE(b.created_at) as date_count_cancel FROM ?? b JOIN ?? u ON b.user_id = u.user_id JOIN bill_details bd ON bd.bill_id = b.bill_id JOIN rooms r ON r.room_id = bd.room_id JOIN hotels h ON h.owner_id=? AND r.hotel_id = h.hotel_id ORDER BY b.created_at DESC LIMIT ? OFFSET ?",
    },
  },
  qTotalRow: {
    ADMIN: {
      sql: "SELECT count(*) as totalRow FROM ??",
    },
    HOTEL: {
      sql: "SELECT count(*) as totalRow FROM ?? b JOIN bill_details bd ON b.bill_id = bd.bill_id JOIN rooms r ON bd.room_id = r.room_id JOIN hotels h ON h.owner_id=? AND r.hotel_id = h.hotel_id",
    },
  },
  qSearch: {
    ADMIN: {
      sql: "SELECT * FROM `bills` b JOIN users u ON MATCH(u.first_name, u.last_name) AGAINST(? IN NATURAL LANGUAGE MODE) AND b.user_id = u.user_id LIMIT ? OFFSET ?",
    },
    HOTEL: {
      sql: "SELECT * FROM `bills` b JOIN users u ON MATCH(u.first_name, u.last_name) AGAINST(? IN NATURAL LANGUAGE MODE) AND b.user_id = u.user_id LIMIT ? OFFSET ?",
    },
  },
  qOrder: {
    ADMIN: {
      sql: "SELECT b.*, u.first_name, u.last_name, h.hotel_name, CURRENT_DATE() - DATE(b.created_at) as date_count_cancel FROM ?? b JOIN ?? u ON b.user_id = u.user_id JOIN bill_details bd ON bd.bill_id = b.bill_id JOIN rooms r ON r.room_id = bd.room_id JOIN hotels h ON r.hotel_id = h.hotel_id ORDER BY ",
    },
    HOTEL: {
      sql: "SELECT b.*, u.first_name, u.last_name, h.hotel_name, CURRENT_DATE() - DATE(b.created_at) as date_count_cancel FROM ?? b JOIN ?? u ON b.user_id = u.user_id JOIN bill_details bd ON bd.bill_id = b.bill_id JOIN rooms r ON r.room_id = bd.room_id JOIN hotels h ON h.owner_id=? AND r.hotel_id = h.hotel_id ORDER BY ",
    },
  },
  qSearchAndOrder: {
    ADMIN: {
      sql: "SELECT h.*, u.first_name, u.last_name FROM ?? h LEFT JOIN users u ON h.owner_id = u.user_id WHERE hotel_name LIKE ? ORDER BY ",
    },
    HOTEL: {
      sql: "SELECT h.*, u.first_name, u.last_name FROM ?? h JOIN users u ON h.owner_id = u.user_id WHERE hotel_name LIKE ? AND owner_id = ? ORDER BY ",
    },
  },
  qOptions: {
    ADMIN: {
      sql: "SELECT hotel_name, hotel_id FROM ??",
    },
    HOTEL: {
      sql: "SELECT hotel_name, hotel_id FROM ?? WHERE owner_id=?",
    },
  },
};

class BillService extends DBModel {
  table = "bills";
  primaryKey = "bill_id";

  create(data = {}) {
    const {
      email,
      booking_for,
      customer_email,
      customer_fullname,
      user_id,
      bill_id,
      rooms,
    } = data;

    return new Promise(async (resolve, reject) => {
      try {
        /**
         * 1. Kiểm tra xem bill này book cho ai.
         *  - Chính họ. (user)
         *  - Cho người khác. (customer_email, full_name)
         * 2. Kiểm tra email có hợp lệ không
         *  - Nếu không thì sẽ không tạo bill
         * 3. Kiểm tra bill có tồn tại phòng đã đặt chưa. input [user_id, room_id, floor_id]
         *  - Nếu bill tồn tại phòng đã đặt thì xét đến trạng thái.
         *    + Xét trạng thái bill ['UNPAID', 'PAID', 'OTHER', 'STARTED_USE', 'ENDED_USE']
         *  - Mặt đinh trạng thái sẽ là UNPAID
         *  - IF (status = UNPAID || status = PAID)
         *      => response: Phòng đã đặt đã có trong kì nghỉ của bạn
         *  - IF (status = STARTED_USE)
         *      => repsonse: Phòng này bạn đang sử dụng.
         *  - IF (status = ENDED_USE)
         *      => Cho phép người này tạo bill mới.
         * 4. Tạo bill
         * 5. Tạo bill detail.
         * 6. Cập nhật lại số lượng phòng có sẵn của room_id và floor_id gửi lên.
         * 7. Gửi bill về mail gửi lên.
         * 8. Phản hồi về người dùng.
         *  - Thông báo thành công.
         */

        // * 1, 2
        await EmailService.validationEmail(
          email,
          `Email ${email} của bạn không hợp lệ!`
        );

        if (booking_for === bookingFor.CUSTOMER) {
          await EmailService.validationEmail(
            customer_email,
            `Email ${customer_email} của khách hàng không hợp lệ!`
          );
        }

        // * 3
        let sql =
          "SELECT * FROM ?? b JOIN ?? bd ON b.bill_id = bd.bill_id WHERE b.user_id = ? AND bd.room_id = ? AND bd.floor_id = ?";

        const [findBill] = await Promise.all(
          rooms.map((room) =>
            pool.query(sql, [
              this.table,
              "bill_details",
              user_id,
              room.room_id,
              room.floor_id,
            ])
          )
        );

        const billExist = [...findBill[0]];
        let checkBillExist = false;

        billExist.forEach((bill) => {
          if (
            bill.status === statuses.PAID.key ||
            bill.status === statuses.UNPAID.key ||
            bill.status === statuses.STARTED_USE
          ) {
            checkBillExist = true;
          }
        });

        // * Đã tồn tại và trạng thái != ENDED_USE.
        if (checkBillExist) {
          return reject(
            this._responseStatusBillBookingExist(statuses.UNPAID.key)
          );
        }

        // * 4. Tạo bill - Chưa tồn tại bill - Trạng thái mặc định là UNPAID (chưa thanh toán)
        let dataInsertBill = getFieldOfObject({
          fileds: [
            "user_id",
            "total_price",
            "note",
            "payment",
            "time_destination",
            "voucher",
            "customer_fullname",
            "customer_email",
          ],
          object: data,
        });

        dataInsertBill = deleteKeyObjectOrNullOrUndefinedOrEmpty({
          ...dataInsertBill,
          booking_for: booking_for,
          start_date: new Date(data.startDate),
          end_date: new Date(data.endDate),
        });

        await this.insert({
          data: {
            ...dataInsertBill,
            email,
            bill_id,
            total_night: data.totalNight,
            status: data.payment === "ONLINE" ? "OTHER" : "UNPAID",
          },
        });

        // * 5 - Tạo bill details.
        const insertFields = [
          "bill_id",
          "floor_id",
          "room_id",
          "price",
          "room_quantity",
        ];

        const dataInsertBillDetails = rooms.map((room) => [
          bill_id,
          room.floor_id,
          room.room_id,
          room.booking_price,
          room.booking_room,
        ]);

        await this.insertBulk({
          table: "bill_details",
          data: dataInsertBillDetails,
          insertFields,
        });

        console.log("rooms:: =>", rooms);

        // * 6 - Cập nhật lại số lượng phòng có sẵn.
        await Promise.all(
          rooms.map((room) => {
            const room_booking = room.room_booking + room.booking_room;

            if (room_booking > room.room_quantity) {
              return Promise.reject(
                new APIError(400, "Phòng này đã được đặt hết")
              );
            }

            this.handleUpdate({
              table: "rooms",
              data: {
                room_booking,
                avaiable: room_booking === room.room_quantity ? 0 : 1,
              },
              id: room.room_id,
              idField: "room_id",
            });
          })
        );

        // * 8 phản hồi khách hàng.
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  sendEmailSuccess = async ({ data = {}, bill_id }) => {
    try {
      // * 7 Gửi mail
      await EmailService.sendEmail({
        subject: "Đặt phòng thành công",
        email: data.email,
        html: billHTML({
          data: data.rooms,
          hotel: {
            total_price: data.total_price,
            hotel_name: data.hotel_name,
            hotel_address: `${data.hotel_address}, ${data.ward_name}, ${data.district_name}, ${data.provice_name}`,
          },
          customer: data.customer_fullname || "",
          note: data.note,
          payment: data.payment,
          bookingFor: data.booking_for,
          userBooking: `${data.last_name} ${data.first_name}`,
          billId: bill_id,
          totalNight: data.totalNight,
          time_destination: data.time_destination,
          startDate: data.startDate,
          endDate: data.endDate,
        }),
      });

      if (data.booking_for === bookingFor.CUSTOMER) {
        // * 7 Gửi mail
        await EmailService.sendEmail({
          subject: `[Booking Hotel]: ${data.last_name} ${data.first_name} đã đặt phòng cho bạn.`,
          email: data.customer_email,
          html: billHTML({
            data: data.rooms,
            hotel: {
              total_price: data.total_price,
              hotel_name: data.hotel_name,
              hotel_address: `${data.hotel_address}, ${data.ward_name}, ${data.district_name}, ${data.provice_name}`,
            },
            customer: data.customer_fullname,
            note: data.note,
            payment: data.payment,
            bookingFor: data.booking_for,
            userBooking: `${data.last_name} ${data.first_name}`,
            billId: bill_id,
            totalNight: data.totalNight,
            time_destination: data.time_destination,
            startDate: data.startDate,
            endDate: data.endDate,
          }),
        });
      }
    } catch (error) {
      throw new APIError(500, error.message);
    }
  };

  resultCountDate = (startDate, endDate) => {
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    const result = differenceInDays(endDate, startDate);
    return result === 0 ? 1 : result;
  };

  _responseStatusBillBookingExist = (status) => {
    return new APIError(400, statuses[status].response);
  };

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

  async getBillDetailsByIdBill(billId) {
    try {
      const sql = SqlString.format(
        "SELECT b.*, room_name FROM bill_details b JOIN rooms r ON b.room_id = r.room_id WHERE b.bill_id = ?",
        [billId]
      );

      const [result] = await pool.query(sql);

      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getAll(filters, user = { role: "ADMIN" }) {
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

        // * dependency query limit and offset;
        const dqLAO =
          user.role === roles.ADMIN
            ? [this.table, "users", limit, offset]
            : [this.table, "users", user.user_id, limit, offset];

        let q = "";

        // * dependency query total row;
        const dqTR =
          user.role === roles.ADMIN ? [this.table] : [this.table, user.user_id];

        let qTotalRow = "";

        if (user.role !== roles.USER) {
          qTotalRow = SqlString.format(
            sqlSwitch.qTotalRow[user.role].sql,
            dqTR
          );
        }

        if (search && !order) {
          q = SqlString.format(sqlSwitch.qSearch[user.role].sql, [
            `${search}`,
            limit,
            offset,
          ]);
        } else if (order && !search) {
          const orderBy = order.split(",").join(" "); // => [hotel_name, desc]; => ? hotel_name desc : hotel_name

          // * dependency query total row;
          const dqTR =
            user.role === roles.ADMIN
              ? [this.table, limit, offset]
              : [this.table, user.user_id, limit, offset];

          q = SqlString.format(
            sqlSwitch.qOrder[user.role].sql + orderBy + " LIMIT ? OFFSET ?",
            dqTR
          );
        } else if (search && order) {
          const orderBy = order.split(",").join(" ");

          q = SqlString.format(
            "SELECT * FROM ?? WHERE hotel_name LIKE ? ORDER BY " +
              orderBy +
              " LIMIT ? OFFSET ?",
            [this.table, `%${search}%`, limit, offset]
          );
        } else if (!_.isEmpty(whereBy)) {
          q = SqlString.format(
            "SELECT b.*, u.first_name, u.last_name, h.hotel_name, CURRENT_DATE() - DATE(b.created_at) as date_count_cancel FROM ?? b JOIN ?? u ON b.user_id = u.user_id JOIN bill_details bd ON bd.bill_id = b.bill_id JOIN rooms r ON r.room_id = bd.room_id JOIN hotels h ON r.hotel_id = h.hotel_id WHERE ?? LIKE ? ORDER BY b.created_at DESC",
            [this.table, "users", whereBy.key, `%${whereBy.value}%`]
          );
        } else {
          q = SqlString.format(sqlSwitch.qLimitAndOffset[user.role].sql, dqLAO);
        }

        const [result] = await pool.query(q);
        let totalRow;

        if (user.role !== roles.USER) {
          totalRow = await pool.query(qTotalRow);
        }

        resolve({
          result,
          paginations: {
            page,
            limit,
            totalPage: totalRow
              ? Math.ceil(totalRow[0][0].totalRow / limit)
              : 0,
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
        const DB = new DBModel("bills");

        await DB.delete({
          id: id,
          idField: "bill_id",
        });

        resolve(true);
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

  async changeStatusByBillId(billId, status, ipAddr) {
    try {
      if (
        status === statuses.STARTED_USE.key ||
        status === statuses.CANCEL.key
      ) {
        // * trả về  số lượng đặt phòng -1
        const sql = SqlString.format(
          "select r.room_id, r.avaiable, r.room_quantity, r.room_booking, bd.room_quantity as booking_room from bills b JOIN bill_details bd ON b.bill_id = bd.bill_id JOIN rooms r ON bd.room_id = r.room_id WHERE b.bill_id=?",
          [billId]
        );

        const [result] = await pool.query(sql);

        if (result?.length) {
          const room_booking = result[0].room_booking - result[0].booking_room; // * tính số phòng order sau khi trừ (SL_ORDER - SL_BOOK)
          const avaiable = 1;

          await this.handleUpdate({
            table: "rooms",
            data: {
              room_booking,
              avaiable,
            },
            idField: "room_id",
            id: result[0].room_id,
          });
        }
      }

      return await this.update(billId, {
        status: statuses[status].transfrom,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default new BillService("bills");
