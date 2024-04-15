import { Router } from "express";
import roomPriceController from "./room-price.controller.js";

const router = Router();

router
  .route("/")
  .post(roomPriceController.create)
  .delete(roomPriceController.delete)
  .get(roomPriceController.getAll);

router
  .route("/:floorId/:roomId/:timeId")
  .delete(roomPriceController.deleteById)
  .get(roomPriceController.getById)
  .patch(roomPriceController.update);

export default router;
