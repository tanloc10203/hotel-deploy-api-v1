import { Router } from "express";
import { upload } from "../../../utils/index.js";
import authMiddleware from "../auth/auth.middleware.js";
import HotelController from "./hotel.controller.js";

const router = Router();

router
  .route("/")
  .post(
    [
      authMiddleware.verifyAccessToken,
      authMiddleware.getUser,
      authMiddleware.verifyRoleAdminAndHotel,
    ],
    upload.fields([
      { name: "hotel_image", maxCount: 1 },
      { name: "h_image_value", maxCount: 50 },
    ]),
    HotelController.create
  )
  .delete(HotelController.delete)
  .get(
    [
      authMiddleware.verifyAccessToken,
      authMiddleware.getUser,
      authMiddleware.verifyRoleAdminAndHotel,
    ],
    HotelController.getAll
  );

router
  .route("/options")
  .get(
    [
      authMiddleware.verifyAccessToken,
      authMiddleware.getUser,
      authMiddleware.verifyRoleAdminAndHotel,
    ],
    HotelController.getOptions
  );

// * client
router.route("/counts-province").get(HotelController.countProvince);
router.route("/list-hotel").get(HotelController.findListHotel);
router.route("/slug/:hotelSlug").get(HotelController.getHotelBySlug);

router
  .route("/:id")
  .delete(
    [
      authMiddleware.verifyAccessToken,
      authMiddleware.getUser,
      authMiddleware.verifyRoleAdminAndHotel,
    ],
    HotelController.deleteById
  )
  .get(
    [
      authMiddleware.verifyAccessToken,
      authMiddleware.getUser,
      authMiddleware.verifyRoleAdminAndHotel,
    ],
    HotelController.getById
  )
  .patch(
    [
      authMiddleware.verifyAccessToken,
      authMiddleware.getUser,
      authMiddleware.verifyRoleAdminAndHotel,
    ],
    upload.fields([
      { name: "hotel_image", maxCount: 1 },
      { name: "h_image_value", maxCount: 50 },
    ]),
    HotelController.update
  );

export default router;
