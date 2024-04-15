import { Router } from "express";
import equipmentController from "./equipment.controller.js";

const router = Router();

router
  .route("/")
  .post(equipmentController.create)
  .delete(equipmentController.delete)
  .get(equipmentController.getAll);

router
  .route("/:floorId/:roomId/:dtId")
  .delete(equipmentController.deleteById)
  .get(equipmentController.getById)
  .patch(equipmentController.update);

export default router;
