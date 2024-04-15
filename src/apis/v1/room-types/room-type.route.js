import { Router } from "express";
import roomTypeController from "./room-type.controller.js";

const router = Router();

router
  .route("/")
  .post(roomTypeController.create)
  .delete(roomTypeController.delete)
  .get(roomTypeController.getAll);

router
  .route("/:id")
  .delete(roomTypeController.deleteById)
  .get(roomTypeController.getById)
  .patch(roomTypeController.update);

export default router;
