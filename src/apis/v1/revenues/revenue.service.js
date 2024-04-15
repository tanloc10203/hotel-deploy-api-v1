import SQLstring from "sqlstring";
import { pool } from "../../../database/index.js";
import { APIError, formatDate } from "../../../utils/index.js";
import { roles } from "../auth/auth.service.js";
import { statuses } from "../bills/bill.service.js";

const statusPass = [
  statuses.PAID.key,
  statuses.ENDED_USE.key,
  statuses.STARTED_USE.key,
];

class RevenueService {
  static revenueByRooms = async (user = { role: roles.ADMIN, user_id: "" }) => {
    try {
      // * Select infor rooms price
      const rooms = await this.selectRoom(user.user_id, user.role);

      // * Calc total value booking room by paid by every room by table `bills`
      const results = await Promise.all(
        rooms.map(async (room) => {
          const revenue = await this.calcTotalPriceByRoomId(room.room_id);

          return {
            ...room,
            revenue,
          };
        })
      );

      return results;
    } catch (error) {
      throw new APIError(error.statusCode || 500, error.message);
    }
  };

  static revenueByDate = async (
    date,
    user = { role: roles.ADMIN, user_id: "" }
  ) => {
    try {
      let sql = SQLstring.format(
        "SELECT SUM(bd.price) AS revenue FROM bills b JOIN bill_details bd ON b.bill_id=bd.bill_id && DATE(b.created_at) = DATE(?) && b.status IN (?)",
        [date, statusPass]
      );

      if (user.role === roles.HOTEL) {
        sql = SQLstring.format(
          "SELECT SUM(bd.price) AS revenue FROM bills b JOIN bill_details bd ON b.bill_id=bd.bill_id && DATE(b.created_at) = DATE(?) && b.status IN (?) JOIN rooms r ON bd.room_id = r.room_id JOIN hotels h ON h.owner_id = ? && r.hotel_id=h.hotel_id",
          [date, statusPass, user.user_id]
        );
      }

      const [result] = await pool.query(sql);

      return {
        date: formatDate(date),
        revenue: +result[0]?.revenue || 0,
      };
    } catch (error) {
      throw new APIError(error.statusCode || 500, error.message);
    }
  };

  static revenueByMonth = async ({
    year = 0,
    month = 0,
    user = { role: roles.ADMIN, user_id: "" },
  }) => {
    try {
      let sql = SQLstring.format(
        "SELECT SUM(bd.price) AS revenue FROM bills b JOIN bill_details bd ON b.bill_id=bd.bill_id && YEAR(b.`created_at`) = ? && MONTH(b.`created_at`) = ? && b.status IN (?)",
        [year, month, statusPass]
      );

      if (user.role === roles.HOTEL) {
        sql = SQLstring.format(
          "SELECT SUM(bd.price) AS revenue FROM bills b JOIN bill_details bd ON b.bill_id=bd.bill_id && YEAR(b.`created_at`) = ? && MONTH(b.`created_at`) = ? && b.status IN (?) JOIN rooms r ON bd.room_id = r.room_id JOIN hotels h ON h.owner_id = ? && r.hotel_id=h.hotel_id",
          [year, month, statusPass, user.user_id]
        );
      }

      const [result] = await pool.query(sql);

      return {
        month: `${month}-${year}`,
        revenue: +result[0]?.revenue || 0,
      };
    } catch (error) {
      throw new APIError(error.statusCode || 500, error.message);
    }
  };

  static revenueByHotels = async (
    user = { role: roles.ADMIN, user_id: "" }
  ) => {
    try {
      const revenueByRooms = await this.revenueByRooms({ ...user });

      const hotels = await this.selecHotel(user.user_id, user.role);

      const data = revenueByRooms.map((result) => ({
        ...result,
        hotel_name:
          user.role === roles.HOTEL
            ? hotels.hotel_name
            : hotels.find((hotel) => hotel.hotel_id === result.hotel_id)
                .hotel_name,
      }));

      return data;
    } catch (error) {
      throw new APIError(error.statusCode || 500, error.message);
    }
  };

  static countBillCancel = async (
    user = { role: roles.ADMIN, user_id: "" }
  ) => {
    try {
      let sql = SQLstring.format(
        "SELECT COUNT(*) as total_bill_cancel FROM bills WHERE status=?",
        [statuses.CANCEL.key]
      );

      if (user.role === roles.HOTEL) {
        sql = SQLstring.format(
          "SELECT COUNT(*) as total_bill_cancel FROM bills b JOIN bill_details bd ON b.status=? && b.bill_id=bd.bill_id JOIN rooms r ON bd.room_id=r.room_id JOIN hotels h ON h.owner_id=? && r.hotel_id=h.hotel_id",
          [statuses.CANCEL.key, user.user_id]
        );
      }

      const [result] = await pool.query(sql);

      return +result[0]?.total_bill_cancel || 0;
    } catch (error) {
      throw new APIError(error.statusCode || 500, error.message);
    }
  };

  static selecHotel = async (ownerId = "", role = roles.ADMIN) => {
    let sql = SQLstring.format("SELECT hotel_id, hotel_name FROM hotels");

    if (role === roles.HOTEL) {
      sql = SQLstring.format(
        "SELECT hotel_id, hotel_name FROM hotels WHERE owner_id=?",
        [ownerId]
      );
    }

    const [rows] = await pool.query(sql);

    return role === roles.ADMIN ? rows : rows[0];
  };

  static selectRoom = async (ownerId = "", role = roles.ADMIN) => {
    let sql = SQLstring.format("SELECT room_id, hotel_id FROM `rooms`");

    if (ownerId && role === roles.HOTEL) {
      sql = SQLstring.format(
        "SELECT room_id FROM `hotels` h JOIN rooms r ON h.owner_id=? && h.hotel_id=r.hotel_id;",
        [ownerId]
      );
    }

    const [rows] = await pool.query(sql);

    return rows;
  };

  static calcTotalPriceByRoomId = async (roomId) => {
    try {
      const sql = SQLstring.format(
        "SELECT SUM(bd.price) as revenue FROM bills b JOIN bill_details bd ON bd.room_id = ? && b.status IN (?) && b.bill_id = bd.bill_id;",
        [roomId, statusPass]
      );

      const [result] = await pool.query(sql);

      return +result[0].revenue || 0;
    } catch (error) {
      throw new APIError(error.statusCode || 500, error.message);
    }
  };
}

export default RevenueService;
