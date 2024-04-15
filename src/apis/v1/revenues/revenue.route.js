import { Router } from "express";
import revenueController from "./revenue.controller.js";
import authMiddleware from "../auth/auth.middleware.js";

const router = Router();

router.get(
  "/rooms",
  [authMiddleware.verifyAccessToken, authMiddleware.getUser],
  revenueController.getRevenueByRoom
);
router.get(
  "/date",
  [authMiddleware.verifyAccessToken, authMiddleware.getUser],
  revenueController.getRevenueByDate
);
router.get(
  "/month",
  [authMiddleware.verifyAccessToken, authMiddleware.getUser],
  revenueController.getRevenueByMonth
);
router.get(
  "/hotels",
  [authMiddleware.verifyAccessToken, authMiddleware.getUser],
  revenueController.getRevenueByHotels
);
router.get(
  "/cancel",
  [authMiddleware.verifyAccessToken, authMiddleware.getUser],
  revenueController.getCountBillCancel
);

export default router;
