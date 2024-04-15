import { Router } from "express";
import { userController } from "../users/index.js";
import authController from "./auth.controller.js";
import authMiddleware from "./auth.middleware.js";

const router = Router();

router.route("/sign-up").post(userController.create);

router.route("/change-password").post(authController.changePassword);

router.route("/forgot-password").post(authController.forgotPassword);

router.post("/register-hotel", authController.registerHotel);
router.post("/verify-register-hotel", authController.verifyRegisterHotel);

router
  .route("/refresh-token")
  .get(authMiddleware.verifyRefreshToken, authController.refreshToken);

router.route("/sign-out").post(authController.signOut);

router.route("/oauth2/google").get(authController.oAuth2Google);

router
  .route("/get/oauth2/google")
  .get(authMiddleware.verifyRefreshToken, authController.getUserSignWithGoogle);

router
  .route("/sign-in")
  .post(authController.signIn)
  .get(authMiddleware.verifyAccessToken, authController.getCurrentCustomer);

export default router;
