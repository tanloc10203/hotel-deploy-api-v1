import { Router } from "express";
import useServiceController from "./use-service.controller.js";

const router = Router();

router
  .route("/")
  .post(useServiceController.create)
  .delete(useServiceController.delete)
  .get(useServiceController.getAll);

router
  .route("/:floorId/:roomId/:billId/:serviceId")
  .delete(useServiceController.deleteById)
  .get(useServiceController.getById)
  .patch(useServiceController.update);

export default router;
