import SqlString from "sqlstring";
import { DBModel, pool } from "../../../database/index.js";
import { APIError } from "../../../utils/index.js";

const statuses = {
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
};

class TransactionService {
  create({ bill_id, order_id, amount, status = statuses.PENDING }) {
    return new Promise(async (resolve, reject) => {
      try {
        /**
         * 1. Kiểm tra bill có tồn tại chưa.
         * 2. Nếu tồn tại thì return
         * 3. Nếu không tồn tại thì tạo.
         */

        const DB = new DBModel("transactions");

        // * 1
        const findTransaction = await DB.find({
          conditions: {
            bill_id,
          },
        });

        // * 2
        if (findTransaction) {
          return reject(
            new APIError(409, `Giao dịch đã tồn tại với bill id = ${bill_id}`)
          );
        }

        // * 3
        await DB.insert({
          data: {
            bill_id,
            order_id,
            amount,
            status,
          },
        });

        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  async update({
    transactionId,
    bankCode,
    payDate,
    responseCode,
    orderId,
    status = statuses.SUCCESS,
  }) {
    try {
      const DB = new DBModel("transactions");

      const response = await DB.handleUpdate({
        data: {
          transaction_id: transactionId,
          bank_code: bankCode,
          pay_date: payDate,
          response_code: responseCode,
          status,
        },
        id: orderId,
        idField: "order_id",
      });

      if (!response) {
        throw new APIError(404, "Giao dịch không tồn tại!");
      }

      return true;
    } catch (error) {
      throw new APIError(500, error.message);
    }
  }
}

export default new TransactionService();
