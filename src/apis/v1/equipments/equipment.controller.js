import { APIError } from "../../../utils/index.js";
import equipmentService from "./equipment.service.js";

class EquipmentController {
  async create(req, res, next) {
    try {
      const body = req.body;

      if (!body.floor_id || !body.room_id || !body.dt_id) {
        return next(new APIError(404, "Missing floor_id, room_id, dt_id!"));
      }

      const response = await equipmentService.create({
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
      const { floorId, roomId, dtId } = req.params;

      const response = await equipmentService.getById(floorId, roomId, dtId);

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
      const response = await equipmentService.getAll(filters);

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
      const { floorId, roomId, dtId } = req.params;

      const response = await equipmentService.deleteById(floorId, roomId, dtId);

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
      const response = await equipmentService.delete();

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
      const { floorId, roomId, dtId } = req.params;
      const data = req.body;

      const response = await equipmentService.update(
        { floorId, roomId, dtId },
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

export default new EquipmentController();
