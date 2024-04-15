import { APIError, formatDate } from "../../../utils/index.js";
import RevenueService from "./revenue.service.js";

class RevenueController {
  getRevenueByRoom = async (req, res, next) => {
    try {
      const user = req.user;

      const response = await RevenueService.revenueByRooms(user);

      res.json({
        message: "Get revenue by rooms success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(error.statusCode || 500, error.message));
    }
  };

  getRevenueByDate = async (req, res, next) => {
    try {
      const { date } = req.query;
      const user = req.user;

      const payload = date || new Date();

      const response = await RevenueService.revenueByDate(payload, user);

      res.json({
        message: `Get revenue by date ${formatDate(payload)} success.`,
        data: response,
      });
    } catch (error) {
      return next(new APIError(error.statusCode || 500, error.message));
    }
  };

  getRevenueByMonth = async (req, res, next) => {
    try {
      const { year, month } = req.query;

      const payload = {
        year: year || new Date().getFullYear(),
        month: month || new Date().getMonth() + 1,
        user: req.user,
      };

      const response = await RevenueService.revenueByMonth(payload);

      res.json({
        message: `Get revenue by month ${payload.month} of year ${payload.year} success.`,
        data: response,
      });
    } catch (error) {
      return next(new APIError(error.statusCode || 500, error.message));
    }
  };

  getRevenueByHotels = async (req, res, next) => {
    try {
      const response = await RevenueService.revenueByHotels(req.user);

      res.json({
        message: `Get revenue by hotel success.`,
        data: response,
      });
    } catch (error) {
      return next(new APIError(error.statusCode || 500, error.message));
    }
  };

  getCountBillCancel = async (req, res, next) => {
    try {
      const response = await RevenueService.countBillCancel(req.user);

      res.json({
        message: `Get count bill cancel success.`,
        data: response,
      });
    } catch (error) {
      return next(new APIError(error.statusCode || 500, error.message));
    }
  };
}

export default new RevenueController();
