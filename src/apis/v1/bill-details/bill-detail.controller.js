import { APIError } from "../../../utils/index.js";
import billDetailService from "./bill-detail.service.js";

class BillDetailController {
  async create(req, res, next) {
    try {
      const body = req.body;

      if (
        !body.bill_id ||
        !body.floor_id ||
        !body.room_id ||
        !body.check_in ||
        !body.check_out ||
        !body.number_of_adults
      ) {
        return next(
          new APIError(
            404,
            "Missing bill_id, floor_id, room_id, price, check_in, check_out, number_of_adults!"
          )
        );
      }

      const response = await billDetailService.create({
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
      const { billId, floorId, roomId } = req.params;

      const response = await billDetailService.getById(billId, floorId, roomId);

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
      const response = await billDetailService.getAll(filters);

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
      const { billId, floorId, roomId } = req.params;

      const response = await billDetailService.deleteById(
        billId,
        floorId,
        roomId
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
      const response = await billDetailService.delete();

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
      const { billId, floorId, roomId } = req.params;
      const data = req.body;

      const response = await billDetailService.update(
        { bill_id: billId, floor_id: floorId, room_id: roomId },
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

export default new BillDetailController();
