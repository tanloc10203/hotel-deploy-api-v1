import {
  authRouter,
  billDetailRouter,
  billRouter,
  concernRouter,
  contractRouter,
  deviceTypeRouter,
  equipmentRouter,
  floorRouter,
  hotelImageRouter,
  hotelRouter,
  registerRouter,
  revenueRouter,
  roomImageRouter,
  roomPriceRouter,
  roomRouter,
  roomTypeRouter,
  serviceRouter,
  statusRouter,
  timeRouter,
  userRouter,
  useServiceRouter,
  vnPayRouter,
} from "../apis/v1/index.js";
import { Router } from "express";
import areaRouter from "../apis/v1/areas/area.route.js";

const router = Router();

router.get("/", (req, res) => {
  return res.json("SERVER RUNNING...");
});
router.use("/api/v1/statuses", statusRouter);
router.use("/api/v1/hotels", hotelRouter);
router.use("/api/v1/concerns", concernRouter);
router.use("/api/v1/contracts", contractRouter);
router.use("/api/v1/registers", registerRouter);
router.use("/api/v1/users", userRouter);
router.use("/api/v1/services", serviceRouter);
router.use("/api/v1/hotel-images", hotelImageRouter);
router.use("/api/v1/device-types", deviceTypeRouter);
router.use("/api/v1/floors", floorRouter);
router.use("/api/v1/room-types", roomTypeRouter);
router.use("/api/v1/times", timeRouter);
router.use("/api/v1/room-images", roomImageRouter);
router.use("/api/v1/rooms", roomRouter);
router.use("/api/v1/room-prices", roomPriceRouter);
router.use("/api/v1/equipments", equipmentRouter);
router.use("/api/v1/bills", billRouter);
router.use("/api/v1/bill-details", billDetailRouter);
router.use("/api/v1/use-services", useServiceRouter);
router.use("/api/v1/auth", authRouter);
router.use("/api/v1/areas", areaRouter);
router.use("/api/v1/vn-pay", vnPayRouter);
router.use("/api/v1/revenue", revenueRouter);

export default router;
