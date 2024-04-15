import SqlString from "sqlstring";
import config from "../../../config/index.js";
import { pool } from "../../../database/index.js";
import {
  APIError,
  compareOTP,
  comparePassword,
  createOTP,
  hashOTP,
  hashPassword,
  ressetPassword,
  signJSWebToken,
  verifyOtpTeamplate,
} from "../../../utils/index.js";
import EmailService from "../emails/email.service.js";
import { userService } from "../users/index.js";
import axios from "axios";
import qs from "qs";
import createUUID from "../../../utils/genaralUuid.js";
import DBModel from "../../../database/DBModel.js";

export const roles = {
  ADMIN: "ADMIN",
  USER: "USER",
  HOTEL: "HOTEL",
};

class AuthService {
  signIn({ username, password }) {
    return new Promise(async (resovle, reject) => {
      try {
        // Find username
        let sql = SqlString.format("SELECT * FROM ?? WHERE username = ?", [
          "users",
          username,
        ]);

        const [result] = await pool.query(sql);

        if (!result.length) {
          return reject(new APIError(404, "Sai tài khoản hoặc mật khẩu."));
        }

        const {
          password: passwordHash,
          user_id,
          role,
          ...others
        } = { ...result[0] };

        // Compare password vs password db.
        const isValidPwd = await comparePassword(password, passwordHash);

        if (!isValidPwd) {
          return reject(
            new APIError(400, "Mật khẩu không đúng. Vui lòng nhập lại.")
          );
        }

        // genarate accessToken and refreshToken
        const accessToken = signJSWebToken({
          privateKey: config.jwt.privateKeyAccessToken,
          data: { user: { user_id } },
          options: { expiresIn: config.jwt.expiredAccessToken },
        });

        const refreshToken = await this.handleRefreshToken(user_id);

        // resovle accessToken and refreshToken to authController
        console.log(role);

        return resovle({
          accessToken,
          refreshToken,
          isHome: role !== roles.ADMIN || role !== roles.HOTEL,
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  handleForgorPassword({ username, email }) {
    return new Promise(async (resovle, reject) => {
      try {
        await EmailService.validationEmail(email);

        let sql = SqlString.format("SELECT * from `users` WHERE username=?", [
          username,
        ]);

        const [findCustomer] = await pool.query(sql); // [[{user_id, ....}]]

        if (!findCustomer.length) {
          return reject(
            new APIError(404, "Không tìm thấy tài khoản. Vui lòng nhập đúng!")
          );
        }

        const { user_id, last_name } = { ...findCustomer[0] };

        // check OTP exist with user_id.
        sql = SqlString.format("SELECT * FROM `tokens` WHERE user_id=?", [
          user_id,
        ]);

        const [findOTP] = await pool.query(sql);

        if (findOTP.length > 0) {
          return reject(
            new APIError(400, "Email đã tồn tại. Vui lòng kiểm tra.")
          );
        }

        // create token: use lib => otp (6 character) => hash otp
        const OTP = createOTP();
        const _hashOTP = await hashOTP(OTP);

        // save hash otp to database. Table Tokens (token: hashOTP, user_id)
        sql = SqlString.format("INSERT INTO ?? SET ?", [
          "tokens",
          { user_id, token: _hashOTP },
        ]);

        await pool.query(sql);

        // create REDIRECT_URL: [URL_SERVER / URL_CLIENT]/api/v1/auth/change-password?user_id=user_id&token=otp [body: password]
        const REDIRECT_URL_CHANGE_PWD = `${config.app.clientURL}/change-password?user_id=${user_id}&token=${OTP}`;

        // send email
        const send = await EmailService.sendEmail({
          email,
          html: ressetPassword({
            lastName: last_name,
            REDIRECT_URL: REDIRECT_URL_CHANGE_PWD,
          }),
        });

        if (send) {
          resovle(true);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  handleChangePassword({ userId, token, password }) {
    return new Promise(async (resovle, reject) => {
      try {
        // find Token
        let sql = SqlString.format("SELECT * FROM `tokens` WHERE user_id=?", [
          userId,
        ]);

        const [findToken] = await pool.query(sql);

        if (!findToken.length) {
          return reject(new APIError(404, "Token not found!"));
        }

        const { token: hash } = { ...findToken[0] };

        // check isValidToken
        const isValidToken = await compareOTP(token, hash);

        if (!isValidToken) {
          return reject(new APIError(400, "Token was not valid!"));
        }

        // hash password
        const _hashPassword = await hashPassword(password);

        // update password to table `customers`
        const response = await userService.update(userId, {
          password: _hashPassword,
        });

        sql = SqlString.format("DELETE FROM `tokens` WHERE user_id=?", [
          userId,
        ]);

        await pool.query(sql);

        resovle(response);
      } catch (error) {
        reject(error);
      }
    });
  }

  getGoogleOAuthTokens({ code }) {
    return new Promise(async (resolve, reject) => {
      const url = "https://oauth2.googleapis.com/token";

      const values = {
        code,
        client_id: config.oauth2.clientID,
        client_secret: config.oauth2.clientSecret,
        redirect_uri: config.oauth2.clientRedirectURL,
        grant_type: "authorization_code",
        access_type: "offline",
      };

      try {
        const response = await axios.post(url, qs.stringify(values), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });

        resolve(response.data);
      } catch (error) {
        console.log("error getGoogleOAuthTokens::: =>", error?.response?.data);
        reject(error);
      }
    });
  }

  getGoogleUser({ id_token, access_token }) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
          {
            headers: {
              Authorization: `Bearer ${id_token}`,
            },
          }
        );

        resolve(response.data);
      } catch (error) {
        console.log("error getGoogleUser::: =>", error?.response);
        reject(error);
      }
    });
  }

  async handleRefreshToken(userId) {
    try {
      let sql = SqlString.format("SELECT * FROM ?? WHERE user_id=?", [
        "seesions",
        userId,
      ]);

      const [findToken] = await pool.query(sql);

      let refreshToken = "";

      if (!findToken.length) {
        refreshToken = signJSWebToken({
          privateKey: config.jwt.privateKeyRefreshToken,
          data: { user: { user_id: userId } },
          options: { expiresIn: config.jwt.expiredRefreshToken },
        });

        sql = SqlString.format("INSERT INTO ?? SET ?", [
          "seesions",
          { user_id: userId, refresh_token: refreshToken },
        ]);

        await pool.query(sql);
      } else {
        refreshToken = findToken[0].refresh_token;
      }

      return refreshToken;
    } catch (error) {
      console.log("error handleRefreshToken::: =>", error);
      Promise.reject(error);
    }
  }

  handleUserSignInWithGoogle(user) {
    return new Promise(async (resolve, reject) => {
      try {
        const DB = new DBModel("users");

        const findUser = await DB.find({
          conditions: {
            email: user.email,
          },
        });

        let id = createUUID();
        let refreshToken = "";

        // * Create user
        if (!findUser) {
          await DB.insert({
            data: {
              user_id: id,
              email: user.email,
              first_name: user.family_name ? user.family_name : "",
              last_name: user.given_name ? user.given_name : "",
              picture: user.picture,
            },
          });
        } else {
          // * update user
          await userService.update(findUser.user_id, {
            email: user.email,
            first_name: user.family_name ? user.family_name : "",
            last_name: user.given_name ? user.given_name : "",
            picture: user.picture,
          });

          id = findUser.user_id;
        }

        if (id) {
          refreshToken = await this.handleRefreshToken(id);
        }

        resolve({ refreshToken });
      } catch (error) {
        console.log("error handleUserSignInWithGoogle,", error);
        reject(error);
      }
    });
  }

  registerHotel(data) {
    return new Promise(async (resovle, reject) => {
      try {
        /**
         ** Bước 1: Kiểm tra email trước khi đăng ký hotel.
         ** Bước 2: Kiểm tra email có tồn tại?
         ** Bước 3: Nếu không tồn tại thì tạo người dùng có role = HOTEL.
         ** Bước 4: Sau khi tạo thành công tạo mã OTP và lưu vào DB
         ** Bước 5: Cuối cùng là gửi mail.
         ** Bước 6: Phản hồi cho người dùng. Trả về user_id
         */

        // * B1

        await EmailService.validationEmail(
          data.email,
          `E-mail ${data.email} không hợp lệ`
        );

        const DB = new DBModel("users");

        // * B2
        const findEmail = await DB.find({ conditions: { email: data.email } });

        if (findEmail) {
          return reject(
            new APIError(400, "E-mail đã tồn tại. Hãy sử dụng email khác.")
          );
        }

        // * B3
        await userService.create(data);

        // * B4
        const OTP = createOTP();
        const _hashOTP = await hashOTP(OTP);

        await DB.insert({
          table: "tokens",
          data: { user_id: data.user_id, token: _hashOTP },
        });

        // * B5
        await EmailService.sendEmail({
          email: data.email,
          html: verifyOtpTeamplate(OTP),
          subject: "[MÃ OTP XÁC THỰC TÀI KHOẢN]",
        });

        return resovle({ user_id: data.user_id });
      } catch (error) {
        return reject(error);
      }
    });
  }

  async verifyRegisterHotel({ userId, otp }) {
    return new Promise(async (resolve, reject) => {
      try {
        /**
         * Bước 1: Tìm token theo userId.
         * Bước 2: So sánh otp với otpHash trong DB.
         * Bước 3: Tìm người dùng theo userId
         * Bước 4: Kiểm tra xem người dùng xác thực chưa.
         * Bước 5: Xác thực người dùng.
         * Bước 6: Xóa otp.
         * Bước 7: Phản hồi thành công.
         */

        const DB = new DBModel("users");

        // * B1.
        const findOTP = await DB.find({
          conditions: {
            user_id: userId,
          },
          table: "tokens",
        });

        if (!findOTP) {
          return reject(new APIError(404, "Find OTP not found!"));
        }

        // * B2
        const isValidOTP = await compareOTP(otp, findOTP.token);

        if (!isValidOTP) {
          return reject(new APIError(404, "Mã xác thực không chính xác!"));
        }

        // * B3.
        const findUser = await DB.find({ user_id: userId });

        if (!findUser) {
          return reject(new APIError(404, "Find User not found!"));
        }

        // * B4
        if (+findUser.is_verify === 1) {
          // * Đã xác thực thành công.
          return resolve(true);
        }

        // * B5.
        const updateUser = await DB.handleUpdate({
          data: {
            is_verify: 1,
          },
          id: userId,
          idField: "user_id",
        });

        if (!updateUser) {
          return reject(new APIError(400, "Cannot verify OTP!"));
        }

        // * B6.
        const deleteOTP = await DB.delete({
          table: "tokens",
          id: userId,
          idField: "user_id",
        });

        console.log("delete:::", deleteOTP);

        return resolve(true);
      } catch (error) {
        return reject(error);
      }
    });
  }
}

export default new AuthService();
