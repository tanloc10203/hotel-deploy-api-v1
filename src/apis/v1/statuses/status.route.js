import { Router } from "express";
import StatusController from "./status.controller.js";

const router = Router();

router
  .route("/")
  .post(StatusController.create)
  .delete(StatusController.delete)
  .get(StatusController.getAll);

router
  .route("/:id")
  .delete(StatusController.deleteById)
  .get(StatusController.getById)
  .patch(StatusController.update);

export default router;
