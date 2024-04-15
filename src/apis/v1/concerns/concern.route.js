import { Router } from "express";
import concernController from "./concern.controller.js";

const router = Router();

router.route("/").post(concernController.create).get(concernController.getAll);

router
  .route("/:id")
  .delete(concernController.deleteById)
  .get(concernController.getById)
  .patch(concernController.update);

export default router;
