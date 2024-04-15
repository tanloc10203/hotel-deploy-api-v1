import { APIError } from "../../../utils/index.js";
import useServiceService from "./use-service.service.js";

class UseServiceController {
  async create(req, res, next) {
    try {
      const body = req.body;

      if (
        !body.bill_id ||
        !body.floor_id ||
        !body.room_id ||
        !body.service_id
      ) {
        return next(
          new APIError(404, "Missing bill_id, floor_id, room_id, service_id!")
        );
      }

      const response = await useServiceService.create({
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
      const { billId, floorId, roomId, serviceId } = req.params;

      const response = await useServiceService.getById(
        billId,
        floorId,
        roomId,
        serviceId
      );

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
      const response = await useServiceService.getAll(filters);

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
      const { billId, floorId, roomId, serviceId } = req.params;

      const response = await useServiceService.deleteById(
        billId,
        floorId,
        roomId,
        serviceId
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
      const response = await useServiceService.delete();

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
      const { billId, floorId, roomId, serviceId } = req.params;
      const data = req.body;

      const response = await useServiceService.update(
        {
          bill_id: billId,
          floor_id: floorId,
          room_id: roomId,
          service_id: serviceId,
        },
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

export default new UseServiceController();
