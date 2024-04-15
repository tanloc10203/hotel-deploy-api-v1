import { APIError } from "../../../utils/index.js";
import registerService from "./register.service.js";

class RegisterController {
  async create(req, res, next) {
    try {
      const body = req.body;

      if (!body.customer_id || !body.hotel_id) {
        return next(new APIError(404, "Missing customer_id, hotel_id!"));
      }

      const response = await registerService.create(body);

      return res.status(201).json({
        message: "Create success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(error.statusCode || 500, error.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const filters = req.query;

      const response = await registerService.getAll(filters);

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
      const customerId = req.params.customerId;
      const hotelId = req.params.hotelId;

      const response = await registerService.deleteById(customerId, hotelId);

      return res.status(200).json({
        message: "Delete success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(500, error.message));
    }
  }
}

export default new RegisterController();
