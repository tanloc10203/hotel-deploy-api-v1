import { APIError } from "../../../utils/index.js";
import deviceTypeService from "./device-type.service.js";
import createUUID from "../../../utils/genaralUuid.js";

class DeviceTypeController {
  async create(req, res, next) {
    try {
      const body = req.body;
      const user = req.user;

      if (!body.dt_name || !body.dt_desc || !body.user_id) {
        return next(
          new APIError(404, "Missing dt_desc or dt_name or user_id!")
        );
      }

      const response = await deviceTypeService.create({
        ...body,
        dt_id: createUUID(),
        role: user.role,
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
      const id = req.params.id;

      const response = await deviceTypeService.getById(id);

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
      const response = await deviceTypeService.getAll(filters);

      return res.status(200).json({
        message: "Get all success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(error.statusCode || 500, error.message));
    }
  }

  async deleteById(req, res, next) {
    try {
      const id = req.params.id;
      const user = req.user;

      const response = await deviceTypeService.deleteById(id, user);

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
      const response = await deviceTypeService.delete();

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
      const id = req.params.id;
      const data = req.body;
      const user = req.user;

      const response = await deviceTypeService.update(id, data, user);

      return res.status(200).json({
        message: "Update success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(error.statusCode || 500, error.message));
    }
  }
}

export default new DeviceTypeController();
