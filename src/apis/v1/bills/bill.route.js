import { Router } from "express";
import billController from "./bill.controller.js";
import authMiddleware from "../auth/auth.middleware.js";

const router = Router();

router
  .route("/")
  .post(billController.create)
  .get(
    [authMiddleware.verifyAccessToken, authMiddleware.getUser],
    billController.getAll
  );
router.get("/details/:billId", billController.getBillDetailsByIdBill);
router.patch("/change-status/:billId", billController.changeStatusByBillId);

export default router;
