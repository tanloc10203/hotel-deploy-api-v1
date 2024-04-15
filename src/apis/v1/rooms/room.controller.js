import { APIError } from "../../../utils/index.js";
import roomService from "./room.service.js";
import _ from "lodash";
import createUUID from "../../../utils/genaralUuid.js";
import { cloudinaryV2 } from "../../../utils/upload.util.js";

class RoomController {
  /**
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   * @returns
   */
  async create(req, res, next) {
    const body = req.body;
    const { room_thumb, r_image_value } = req.files;

    try {
      if (
        !body.floor_id ||
        !body.rt_id ||
        !body.status_id ||
        !body.hotel_id ||
        !body.room_name ||
        !room_thumb.length ||
        !r_image_value.length ||
        !body.max_people
      ) {
        await Promise.all(
          room_thumb.map((h) => cloudinaryV2.uploader.destroy(h.filename))
        );
        await Promise.all(
          r_image_value.map((h) => cloudinaryV2.uploader.destroy(h.filename))
        );

        return next(
          new APIError(
            404,
            "Missing floor_id, rt_id, status_id, room_name, room_thumb, r_image_value, hotel_id, max_people!"
          )
        );
      }

      const response = await roomService.create({
        ...body,
        room_thumb,
        r_image_value,
        room_id: createUUID(),
      });

      return res.status(201).json({
        message: "Create success.",
        data: response,
      });
    } catch (error) {
      await Promise.all(
        room_thumb.map((h) => cloudinaryV2.uploader.destroy(h.filename))
      );
      await Promise.all(
        r_image_value.map((h) => cloudinaryV2.uploader.destroy(h.filename))
      );
      return next(new APIError(error.statusCode || 500, error.message));
    }
  }

  async getById(req, res, next) {
    try {
      const id = req.params.id;

      const response = await roomService.getById(id);

      return res.status(200).json({
        message: "Get success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(error.statusCode || 500, error.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const filters = req.query;
      const user = req.user;
      const response = await roomService.getAll(filters, user);

      return res.status(200).json({
        message: "Get all success.",
        data: response,
      });
    } catch (error) {
      console.log("error getALL", error);
      return next(new APIError(error.statusCode || 500, error.message));
    }
  }

  async deleteById(req, res, next) {
    try {
      const id = req.params.id;

      const response = await roomService.deleteById(id);

      return res.status(200).json({
        message: "Delete success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(error.statusCode || 500, error.message));
    }
  }

  async delete(req, res, next) {
    try {
      const response = await roomService.delete();

      return res.status(200).json({
        message: "Delete all success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(error.statusCode || 500, error.message));
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
    const { room_thumb, r_image_value } = req.files;

    try {
      data = {
        ...data,
        room_thumb: room_thumb || null,
        r_image_value: r_image_value || null,
        img_delete: data?.img_delete ? JSON.parse(data.img_delete) : null,
      };

      const response = await roomService.update(id, data);

      return res.status(200).json({
        message: "Update success.",
        data: response,
      });
    } catch (error) {
      room_thumb?.length > 0 &&
        (await Promise.all(
          room_thumb?.map((h) => cloudinaryV2.uploader.destroy(h.filename))
        ));

      r_image_value?.length > 0 &&
        (await Promise.all(
          r_image_value?.map((h) => cloudinaryV2.uploader.destroy(h.filename))
        ));
      return next(new APIError(error.statusCode || 500, error.message));
    }
  }
}

export default new RoomController();
