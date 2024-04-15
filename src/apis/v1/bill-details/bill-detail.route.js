import { Router } from "express";
import billDetailController from "./bill-detail.controller.js";

const router = Router();

router
  .route("/")
  .post(billDetailController.create)
  .delete(billDetailController.delete)
  .get(billDetailController.getAll);

router
  .route("/:floorId/:roomId/:billId")
  .delete(billDetailController.deleteById)
  .get(billDetailController.getById)
  .patch(billDetailController.update);

export default router;
