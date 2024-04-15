import config from "../../../config/index.js";
import { APIError, createUUID, signJSWebToken } from "../../../utils/index.js";
import { userService } from "../users/index.js";
import authService from "./auth.service.js";
import SqlString from "sqlstring";
import pool from "../../../database/init.mysql.js";

const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV !== "production" ? false : true,
  path: "/",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  maxAge: 3.154e10, // 1 year
};

class AuthController {
  async signIn(req, res, next) {
    try {
      const body = req.body;

      if (!body.username || !body.password) {
        return next(new APIError(404, "Missing username or password"));
      }

      const response = await authService.signIn({
        username: body.username,
        password: body.password,
      });

      return res
        .cookie(
          "refreshToken",
          response.refreshToken,
          refreshTokenCookieOptions
        )
        .json({ accessToken: response.accessToken, isHome: response.isHome });
    } catch (error) {
      next(new APIError(error.statusCode || 500, error.message));
    }
  }

  async getCurrentCustomer(req, res, next) {
    try {
      const user_id = req.user_id;

      const response = await userService.getById(user_id);

      res.json({
        data: response,
        message: "Get current customer successed.",
      });
    } catch (error) {
      next(new APIError(error.statusCode || 500, error.message));
    }
  }

  async getUserSignWithGoogle(req, res, next) {
    try {
      const user_id = req.user_id;

      const response = await userService.getById(user_id);

      const accessToken = signJSWebToken({
        privateKey: config.jwt.privateKeyAccessToken,
        data: { user: { user_id } },
        options: { expiresIn: config.jwt.expiredAccessToken },
      });

      res.json({
        data: response,
        accessToken,
        message: "Get current customer successed.",
      });
    } catch (error) {
      next(new APIError(error.statusCode || 500, error.message));
    }
  }

  async refreshToken(req, res, next) {
    try {
      const user_id = req.user_id;

      // create accessToken and refreshToken new
      const accessToken = signJSWebToken({
        privateKey: config.jwt.privateKeyAccessToken,
        data: { user: { user_id } },
        options: { expiresIn: config.jwt.expiredAccessToken },
      });

      // setCookies refreshToken and response client.
      res.json({ accessToken, message: "Get accessToken new successed." });
    } catch (error) {
      next(new APIError(error.statusCode || 500, error.message));
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { email, username } = req.body;

      if (!email || !username) {
        return next(new APIError(404, "Missing email, username!"));
      }

      const response = await authService.handleForgorPassword({
        email,
        username,
      });

      res.json({
        message: "Send email successed.",
        isValid: response,
      });
    } catch (error) {
      next(new APIError(error.statusCode || 500, error.message));
    }
  }

  async changePassword(req, res, next) {
    try {
      const { user_id, token } = req.query;
      const { password } = req.body;

      if (!user_id || !token || !password) {
        return next(
          new APIError(404, "Missing params user_id or token or password!")
        );
      }

      await authService.handleChangePassword({
        userId: user_id,
        token,
        password,
      });

      res.json({
        message: "Changed password successed.",
      });
    } catch (error) {
      next(new APIError(error.statusCode || 500, error.message));
    }
  }

  async signOut(req, res, next) {
    try {
      const { refreshToken } = req.cookies;

      const sql = SqlString.format(
        "DELETE FROM `seesions` WHERE refresh_token=?",
        [refreshToken]
      );

      await pool.query(sql);

      res.clearCookie("refreshToken");
      res.status(200).json({
        message: "Đăng xuất thành công.",
      });
    } catch (error) {
      next(error);
    }
  }

  async oAuth2Google(req, res, next) {
    try {
      // get the code from qs
      const code = req.query.code;

      // get the id and access token with the code
      const { id_token, access_token } = await authService.getGoogleOAuthTokens(
        { code }
      );

      // get user with token
      const googleUser = await authService.getGoogleUser({
        id_token,
        access_token,
      });

      if (!googleUser.verified_email) {
        return res.status(403).send("Google account is not verified!");
      }

      // upsert the user save db
      const { refreshToken } = await authService.handleUserSignInWithGoogle(
        googleUser
      );

      res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

      res.redirect(config.app.clientURL);
    } catch (error) {
      console.log("Failer to authorize Google user :::", error);
    }
  }

  async registerHotel(req, res, next) {
    try {
      const data = req.body;

      const response = await authService.registerHotel({
        ...data,
        user_id: createUUID(),
      });

      return res.status(201).json({
        message: "Register hotel success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(error.statusCode || 500, error.message));
    }
  }

  async verifyRegisterHotel(req, res, next) {
    try {
      const data = req.body;

      if (!data.userId || !data.otp) {
        return next(
          new APIError(error.statusCode || 500, "Missing userId or otp")
        );
      }

      const response = await authService.verifyRegisterHotel({
        userId: data.userId,
        otp: data.otp,
      });

      return res.status(201).json({
        message: "Verify register hotel success.",
        data: response,
      });
    } catch (error) {
      return next(new APIError(error.statusCode || 500, error.message));
    }
  }
}

export default new AuthController();
