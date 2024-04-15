import { Router } from "express";
import floorController from "./floor.controller.js";
import authMiddleware from "../auth/auth.middleware.js";

const router = Router();

router
  .route("/")
  .post(floorController.create)
  .delete(floorController.delete)
  .get(
    [
      authMiddleware.verifyAccessToken,
      authMiddleware.getUser,
      authMiddleware.verifyRoleAdminAndHotel,
    ],
    floorController.getAll
  );

router
  .route("/:id")
  .delete(floorController.deleteById)
  .get(floorController.getById)
  .patch(floorController.update);

export default router;
