import { Router } from "express";
import authMiddleware from "../auth/auth.middleware.js";
import deviceTypeController from "./device-type.controller.js";

const router = Router();

router
  .route("/")
  .post(
    [
      authMiddleware.verifyAccessToken,
      authMiddleware.getUser,
      authMiddleware.verifyRoleAdminAndHotel,
    ],
    deviceTypeController.create
  )
  .get(
    [
      authMiddleware.verifyAccessToken,
      authMiddleware.getUser,
      authMiddleware.verifyRoleAdminAndHotel,
    ],
    deviceTypeController.getAll
  );

router
  .route("/:id")
  .delete(
    [
      authMiddleware.verifyAccessToken,
      authMiddleware.getUser,
      authMiddleware.verifyRoleAdminAndHotel,
    ],
    deviceTypeController.deleteById
  )
  .get(
    [
      authMiddleware.verifyAccessToken,
      authMiddleware.getUser,
      authMiddleware.verifyRoleAdminAndHotel,
    ],
    deviceTypeController.getById
  )
  .patch(
    [
      authMiddleware.verifyAccessToken,
      authMiddleware.getUser,
      authMiddleware.verifyRoleAdminAndHotel,
    ],
    deviceTypeController.update
  );

export default router;
