import { Router } from "express";
import vnPayController from "./vn-pay.controller.js";
import DBModel from "../../../database/DBModel.js";
import { generateOrderId } from "../../../utils/functions.js";

const router = Router();

router.post("/create-payment-url", vnPayController.createPaymentUrl);
router.get("/return", vnPayController.vnpayReturn);
router.post("/refund", vnPayController.vnpayRefund);
router.get("/transaction/:id", async (req, res, next) => {
  try {
    const DB = new DBModel("transactions");

    const transaction = await DB.find({
      conditions: {
        bill_id: req.params.id,
      },
    });

    res.json({
      ...transaction,
      AAA: generateOrderId(transaction.pay_date),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
