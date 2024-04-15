import { Router } from "express";
import timeController from "./time.controller.js";

const router = Router();

router
  .route("/")
  .post(timeController.create)
  .delete(timeController.delete)
  .get(timeController.getAll);

router
  .route("/:id")
  .delete(timeController.deleteById)
  .get(timeController.getById)
  .patch(timeController.update);

export default router;
