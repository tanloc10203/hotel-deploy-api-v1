import { APIError, createUUID, generateOrderId } from "../../../utils/index.js";
import transactionService from "../transactions/transaction.service.js";
import VNPayService from "../vn-pay/vn-pay.service.js";
import billService from "./bill.service.js";

const payments = {
  OFFLINE: "OFFLINE",
  ONLINE: "ONLINE",
};

class BillController {
  /**
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   * @returns
   */
  async create(req, res, next) {
    const body = req.body;
    const bill_id = createUUID();
    const orderId = generateOrderId();

    try {
      if (!body.user_id || !body.total_price || !body.payment || !body.rooms) {
        return next(
          new APIError(404, "Missing user_id, total_price, payment, rooms!")
        );
      }

      const response = await billService.create({
        ...body,
        bill_id,
      });

      if (body.payment === payments.OFFLINE) {
        await billService.sendEmailSuccess({ data: body, bill_id });

        return res.status(201).json({
          message: "Booking success.",
          response,
        });
      } else {
        await transactionService.create({
          bill_id,
          amount: body.total_price,
          order_id: orderId,
        });

        const ipAddr =
          req.headers["x-forwarded-for"] ||
          req.connection.remoteAddress ||
          req.socket.remoteAddress ||
          req.connection.socket.remoteAddress;

        const url = await VNPayService.handleCreatePaymentUrl({
          ipAddr,
          amount: body.total_price,
          bankCode: "",
          orderId: orderId,
        });

        return res.status(200).json({
          url,
        });
      }
    } catch (error) {
      console.log(error);
      await billService.deleteById(bill_id);
      return next(new APIError(error.statusCode || 500, error.message));
    }
  }

  async getBillDetailsByIdBill(req, res, next) {
    try {
      const { billId } = req.params;

      const response = await billService.getBillDetailsByIdBill(billId);

      return res.status(200).json({
        message: "Get bill details success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(error.statusCode || 500, error.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const user = req.user;
      const filters = req.query;
      const response = await billService.getAll(filters, user);

      return res.status(200).json({
        message: "Get all success.",
        data: response,
      });
    } catch (error) {
      console.log("error getALL", error);
      return next(new APIError(error.statusCode || 500, error.message));
    }
  }

  async changeStatusByBillId(req, res, next) {
    try {
      const { billId } = req.params;
      const data = req.body;

      const ipAddr =
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

      if (!data.status) {
        return next(new APIError(400, "Missing key status"));
      }

      const response = await billService.changeStatusByBillId(
        billId,
        data.status,
        ipAddr
      );

      return res.status(200).json({
        message: `Update status "${data.status}" success.`,
        data: response,
      });
    } catch (error) {
      console.log(error);
      return next(new APIError(error.statusCode || 500, error.message));
    }
  }
}

export default new BillController();
