import { Router } from "express";
import serivceController from "./service.controller.js";

const router = Router();

router
  .route("/")
  .post(serivceController.create)
  .delete(serivceController.delete)
  .get(serivceController.getAll);

router
  .route("/:id")
  .delete(serivceController.deleteById)
  .get(serivceController.getById)
  .patch(serivceController.update);

export default router;
