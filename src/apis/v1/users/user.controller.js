import {
  APIError,
  deleteKeyObjectOrNullOrUndefinedOrEmpty,
} from "../../../utils/index.js";
import userService from "./user.service.js";
import createUUID from "../../../utils/genaralUuid.js";
import _ from "lodash";
import { cloudinaryV2 } from "../../../utils/upload.util.js";

class UserController {
  async create(req, res, next) {
    try {
      const body = req.body;

      if (
        !body.first_name ||
        !body.last_name ||
        !body.email ||
        !body.username ||
        !body.password ||
        !body.phone
      ) {
        return next(
          new APIError(
            404,
            "Missing first_name, last_name, email, username, password, phone!"
          )
        );
      }

      const response = await userService.create({
        ...body,
        user_id: createUUID(),
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

      const response = await userService.getById(id);

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
      const response = await userService.getAll(filters);

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

      const response = await userService.deleteById(id);

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
      const response = await userService.delete();

      return res.status(200).json({
        message: "Delete all success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(error.statusCode || 500, error.message));
    }
  }

  async update(req, res, next) {
    const picture = req.file;

    try {
      const id = req.params.id;
      let data = req.body;

      data = deleteKeyObjectOrNullOrUndefinedOrEmpty({
        ...data,
        picture: !_.isEmpty(picture) ? picture : null,
      });

      const response = await userService.update(id, data);

      return res.status(200).json({
        message: "Update success.",
        data: response,
      });
    } catch (error) {
      if (!_.isEmpty(picture)) {
        await cloudinaryV2.uploader.destroy(picture.filename);
      }

      return next(new APIError(error.statusCode || 500, error.message));
    }
  }
}

export default new UserController();
