import { Router } from "express";
import upload from "../../../utils/upload.util.js";
import userController from "./user.controller.js";

const router = Router();

router
  .route("/")
  .post(userController.create)
  .delete(userController.delete)
  .get(userController.getAll);

router
  .route("/:id")
  .delete(userController.deleteById)
  .get(userController.getById)
  .patch(upload.single("picture"), userController.update);

export default router;
