import { APIError } from "../../../utils/index.js";
import StatusService from "./status.service.js";
import createUUID from "../../../utils/genaralUuid.js";

class StatusController {
  async create(req, res, next) {
    try {
      const body = req.body;

      if (!body.type || !body.desc || !body.key || !body.value) {
        return next(new APIError(404, "Missing type, desc, key, value!"));
      }

      const response = await StatusService.create({
        ...body,
        status_id: createUUID(),
      });

      return res.status(201).json({
        message: "Create status success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(error.statusCode || 500, error.message));
    }
  }

  async getById(req, res, next) {
    try {
      const id = req.params.id;

      const response = await StatusService.getById(id);

      return res.status(200).json({
        message: "Get status success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(error.statusCode || 500, error.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const response = await StatusService.getAll(req.query);

      return res.status(200).json({
        message: "Get all status success.",
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

      const response = await StatusService.update(id, data);

      return res.status(200).json({
        message: "Update status success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(error.statusCode || 500, error.message));
    }
  }

  async deleteById(req, res, next) {
    try {
      const id = req.params.id;

      const response = await StatusService.deleteById(id);

      return res.status(200).json({
        message: "Delete status success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(error.statusCode || 500, error.message));
    }
  }

  async delete(req, res, next) {
    try {
      const response = await StatusService.delete();

      return res.status(200).json({
        message: "Delete all status success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(error.statusCode || 500, error.message));
    }
  }
}

export default new StatusController();
