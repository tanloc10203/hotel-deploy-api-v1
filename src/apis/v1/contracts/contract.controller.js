import { APIError } from "../../../utils/index.js";
import contractService from "./contract.service.js";

class ContractController {
  async create(req, res, next) {
    try {
      const body = req.body;

      if (
        !body.concern_id ||
        !body.hotel_id ||
        !body.date_start ||
        !body.date_end
      ) {
        return next(
          new APIError(
            404,
            "Missing concern_id, hotel_id, date_start, date_end!"
          )
        );
      }

      const response = await contractService.create(body);

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

      const response = await contractService.getAll(filters);

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
      const concernId = req.params.concernId;
      const hotelId = req.params.hotelId;

      const response = await contractService.deleteById(concernId, hotelId);

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
      const response = await contractService.delete();

      return res.status(200).json({
        message: "Delete all success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(500, error.message));
    }
  }
}

export default new ContractController();
