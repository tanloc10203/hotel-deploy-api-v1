import createUUID from "../../../utils/genaralUuid.js";
import { APIError } from "../../../utils/index.js";
import floorService from "./floor.service.js";

class HotelController {
  async create(req, res, next) {
    try {
      const body = req.body;

      if (!body.floor_name || !body.floor_type || !body.hotel_id) {
        return next(
          new APIError(404, "Missing floor_name or floor_type or hotel_id!")
        );
      }

      const response = await floorService.create({
        ...body,
        floor_id: createUUID(),
      });

      return res.status(201).json({
        message: "Create success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(500, error.message));
    }
  }

  async getById(req, res, next) {
    try {
      const id = req.params.id;

      const response = await floorService.getById(id);

      return res.status(200).json({
        message: "Get success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(500, error.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const filters = req.query;
      const user = req.user;

      const response = await floorService.getAll(filters, user);

      return res.status(200).json({
        message: "Get all success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(500, error.message));
    }
  }

  async deleteById(req, res, next) {
    try {
      const id = req.params.id;

      const response = await floorService.deleteById(id);

      return res.status(200).json({
        message: "Delete success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(500, error.message));
    }
  }

  async delete(req, res, next) {
    try {
      const response = await floorService.delete();

      return res.status(200).json({
        message: "Delete all success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(500, error.message));
    }
  }

  async update(req, res, next) {
    try {
      const id = req.params.id;
      const data = req.body;

      const response = await floorService.update(id, data);

      return res.status(200).json({
        message: "Update success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(500, error.message));
    }
  }
}

export default new HotelController();
