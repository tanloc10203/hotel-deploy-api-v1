import { APIError } from "../../../utils/index.js";
import hotelService from "./hotel.service.js";
import _ from "lodash";
import { cloudinaryV2 } from "../../../utils/upload.util.js";
import createUUID from "../../../utils/genaralUuid.js";
import { roles } from "../auth/auth.service.js";

class HotelController {
  /**
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   * @returns
   */
  async create(req, res, next) {
    const body = req.body;
    const { hotel_image, h_image_value } = req.files;
    const user = req.user;

    try {
      if (
        !body.hotel_name ||
        !body.hotel_desc ||
        !body.hotel_address ||
        !body.slug ||
        !hotel_image.length ||
        !h_image_value.length
      ) {
        await Promise.all(
          hotel_image.map((h) => cloudinaryV2.uploader.destroy(h.filename))
        );
        await Promise.all(
          h_image_value.map((h) => cloudinaryV2.uploader.destroy(h.filename))
        );
        return next(
          new APIError(
            404,
            "Missing hotel_name, hotel_desc, hotel_address, hotel_image, h_image_value, slug!"
          )
        );
      }

      const response = await hotelService.create(
        {
          ...body,
          tags: JSON.parse(body.tags),
          hotel_image,
          h_image_value,
          hotel_id: createUUID(),
        },
        user
      );

      return res.status(201).json({
        message: "Create success.",
        data: response,
      });
    } catch (error) {
      Promise.all(
        hotel_image.map((h) => cloudinaryV2.uploader.destroy(h.filename))
      );
      Promise.all(
        h_image_value.map((h) => cloudinaryV2.uploader.destroy(h.filename))
      );
      return next(new APIError(500, error.message));
    }
  }

  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns
   */
  async getById(req, res, next) {
    try {
      const id = req.params.id;

      const response = await hotelService.getById(id);

      return res.status(200).json({
        message: "Get success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(500, error.message));
    }
  }

  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns
   */
  async getAll(req, res, next) {
    try {
      const filters = req.query;
      const user = req.user;
      let ownerId = null;

      if (user.role === roles.HOTEL) {
        ownerId = user.user_id;
      }

      const response = await hotelService.getAll(filters, user);

      return res.status(200).json({
        message: "Get all success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(500, error.message));
    }
  }

  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns
   */
  async deleteById(req, res, next) {
    try {
      const id = req.params.id;

      const response = await hotelService.deleteById(id);

      return res.status(200).json({
        message: "Delete success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(500, error.message));
    }
  }

  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns
   */
  async delete(req, res, next) {
    try {
      const response = await hotelService.delete();

      return res.status(200).json({
        message: "Delete all success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(500, error.message));
    }
  }

  /**
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   * @returns
   */
  async update(req, res, next) {
    let data = req.body;
    const id = req.params.id;
    const { hotel_image, h_image_value } = req.files;

    try {
      data = {
        ...data,
        hotel_image: hotel_image || null,
        h_image_value: h_image_value || null,
        tag_delete: data?.tag_delete ? JSON.parse(data?.tag_delete) : null,
        tag_news: data?.tag_news ? JSON.parse(data?.tag_news) : null,
        img_delete: data?.img_delete ? JSON.parse(data?.img_delete) : null,
      };

      const response = await hotelService.update(id, data);

      return res.status(200).json({
        message: "Update success.",
        data: response,
      });
    } catch (error) {
      console.log("error:::", error);
      Promise.all(
        hotel_image.map((h) => cloudinaryV2.uploader.destroy(h.filename))
      );
      Promise.all(
        h_image_value.map((h) => cloudinaryV2.uploader.destroy(h.filename))
      );
      return next(new APIError(500, error.message));
    }
  }

  /**
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   * @returns
   */
  async getOptions(req, res, next) {
    try {
      res.json({
        message: "Get options success.",
        data: await hotelService.getOptions(req.user),
      });
    } catch (error) {
      return next(new APIError(500, error.message));
    }
  }

  /**
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   * @returns
   */
  async countProvince(req, res, next) {
    try {
      res.json({
        message: "Get countProvince success.",
        data: await hotelService.countProvince(),
      });
    } catch (error) {
      return next(new APIError(500, error.message));
    }
  }

  /**
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   * @returns
   */
  async findListHotel(req, res, next) {
    try {
      const { destination, total_people } = req.query;

      res.json({
        message: "Get countProvince success.",
        data: await hotelService.findListHotel({
          destination,
          totalPeople: total_people,
        }),
      });
    } catch (error) {
      return next(new APIError(500, error.message));
    }
  }

  /**
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   * @returns
   */
  async getHotelBySlug(req, res, next) {
    try {
      const { hotelSlug } = req.params;

      res.json({
        message: "Get getHotelBySlug success.",
        data: await hotelService.getHotelBySlug({
          slug: hotelSlug,
        }),
      });
    } catch (error) {
      return next(new APIError(500, error.message));
    }
  }
}

export default new HotelController();
