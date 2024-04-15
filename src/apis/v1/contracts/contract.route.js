import { Router } from "express";
import contractController from "./contract.controller.js";

const router = Router();

router
  .route("/")
  .post(contractController.create)
  .get(contractController.getAll);

router.route("/:concernId/:hotelId").delete(contractController.deleteById);

export default router;
