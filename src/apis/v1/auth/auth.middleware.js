import _ from "lodash";
import SqlString from "sqlstring";
import config from "../../../config/index.js";
import { DBModel, pool } from "../../../database/index.js";
import { APIError, verifyJSWebToken } from "../../../utils/index.js";
import { roles } from "./auth.service.js";

class AuthMiddleware {
  /**
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   * @returns
   */
  async verifyAccessToken(req, res, next) {
    try {
      // Bearer accessToken...
      const Authorization = req.headers.authorization;

      if (!Authorization) {
        return next(new APIError(401, "Please sign in again!"));
      }

      const accessToken = Authorization.split(" ")[1];

      const decode = await verifyJSWebToken({
        token: accessToken,
        privateKey: config.jwt.privateKeyAccessToken,
      });

      req.user_id = decode.user_id;

      next();
    } catch (error) {
      next(new APIError(error.statusCode || 500, error.message));
    }
  }

  /**
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   * @returns
   */
  async getUser(req, res, next) {
    try {
      const userId = req.user_id;

      if (!userId) {
        return next(new APIError(401, "AccessToken invalid!"));
      }

      const DB = new DBModel("users");

      const user = await DB.find({
        conditions: {
          user_id: userId,
        },
      });

      if (!user) {
        return next(new APIError(404, "Not found user with accessToken!"));
      }

      const { password, ...others } = user;

      req.user = others;

      return next();
    } catch (error) {
      return next(new APIError(error.statusCode || 500, error.message));
    }
  }

  /**
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   * @returns
   */
  verifyAdmin(req, res, next) {
    try {
      const user = req.user;

      if (_.isEmpty(user)) {
        return next(
          new APIError(
            404,
            "Cannot verify admin because missing user. Please sign-in."
          )
        );
      }

      if (user.role !== roles.ADMIN)
        return next(new APIError(403, "You're not acceptable!"));

      return next();
    } catch (error) {
      return next(new APIError(error.statusCode || 500, error.message));
    }
  }

  /**
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   * @returns
   */
  verifyRoleAdminAndHotel(req, res, next) {
    try {
      const user = req.user;

      if (_.isEmpty(user)) {
        return next(
          new APIError(
            404,
            "Cannot verify admin because missing user. Please sign-in."
          )
        );
      }

      if (user.role === roles.USER)
        return next(new APIError(403, "You're not acceptable!"));

      return next();
    } catch (error) {
      return next(new APIError(error.statusCode || 500, error.message));
    }
  }

  /**
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   * @returns
   */
  async verifyRefreshToken(req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return next(new APIError(401, "Please sign in again!"));
      }

      // find Refresh Token to db
      const sql = SqlString.format("SELECT * FROM ?? WHERE refresh_token=?", [
        "seesions",
        refreshToken,
      ]);

      const [findToken] = await pool.query(sql);

      if (!findToken.length) {
        return next(new APIError(403, "jwt refreshToken expired"));
      }

      const decode = await verifyJSWebToken({
        token: refreshToken,
        privateKey: config.jwt.privateKeyRefreshToken,
      });

      req.user_id = decode.user_id;

      next();
    } catch (error) {
      if (error.message === "jwt expired") {
        // delete refresh Token db and send message client sign again.
        const refreshToken = req.cookies.refreshToken;

        const sql = SqlString.format("DELETE FROM ?? WHERE refresh_token=?", [
          "seesions",
          refreshToken,
        ]);

        await pool.query(sql);

        return next(new APIError(403, "jwt refreshToken expired"));
      }

      next(new APIError(error.statusCode || 500, error.message));
    }
  }
}

export default new AuthMiddleware();
