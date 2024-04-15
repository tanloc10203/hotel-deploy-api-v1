import { APIError } from "../../../utils/index.js";
import timeService from "./time.service.js";

class TimeController {
  async create(req, res, next) {
    try {
      const body = req.body;

      if (!body.date) {
        return next(new APIError(404, "Missing date !"));
      }

      const response = await timeService.create({
        ...body,
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

      const response = await timeService.getById(id);

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

      const response = await timeService.getAll(filters);

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

      const response = await timeService.deleteById(id);

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
      const response = await timeService.delete();

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

      const response = await timeService.update(id, data);

      return res.status(200).json({
        message: "Update success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(500, error.message));
    }
  }
}

export default new TimeController();
