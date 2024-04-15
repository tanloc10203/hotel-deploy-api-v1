import { APIError } from "../../../utils/index.js";
import roomPriceService from "./room-price.service.js";

class RoomPriceController {
  async create(req, res, next) {
    try {
      const body = req.body;

      if (!body.floor_id || !body.room_id || !body.time_id || !body.price) {
        return next(
          new APIError(404, "Missing floor_id, room_id, time_id, price!")
        );
      }

      const response = await roomPriceService.create({
        ...body,
      });

      return res.status(201).json({
        message: "Create success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(error.statusCode || 500, error.message));
    }
  }

  async getById(req, res, next) {
    try {
      const { floorId, roomId, timeId } = req.params;

      const response = await roomPriceService.getById(floorId, roomId, timeId);

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
      const response = await roomPriceService.getAll(filters);

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
      const { floorId, roomId, timeId } = req.params;

      const response = await roomPriceService.deleteById(
        floorId,
        roomId,
        timeId
      );

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
      const response = await roomPriceService.delete();

      return res.status(200).json({
        message: "Delete all success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(error.statusCode || 500, error.message));
    }
  }

  async update(req, res, next) {
    try {
      const { floorId, roomId, timeId } = req.params;
      const data = req.body;

      const response = await roomPriceService.update(
        { floorId, roomId, timeId },
        data
      );

      return res.status(200).json({
        message: "Update success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(error.statusCode || 500, error.message));
    }
  }
}

export default new RoomPriceController();
