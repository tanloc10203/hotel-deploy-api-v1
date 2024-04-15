import { Router } from "express";
import registerController from "./register.controller.js";

const router = Router();

router
  .route("/")
  .post(registerController.create)
  .get(registerController.getAll);

router.route("/:customerId/:hotelId").delete(registerController.deleteById);

export default router;
