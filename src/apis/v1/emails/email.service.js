import _ from "lodash";
import nodemailer from "nodemailer";
import config from "../../../config/index.js";
import APIError from "../../../utils/api-error.util.js";
import { validate } from "deep-email-validator";

class EmailService {
  static sendEmail({ email, html, subject = "Quên mật khẩu ✔" }) {
    return new Promise(async (resovle, reject) => {
      try {
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: config.account.email, // generated ethereal user
            pass: config.account.password, // generated ethereal password
          },
        });

        console.log(`config send email:::`, config.account);

        let info = await transporter.sendMail({
          from: `"Manager Booking Hotel 👻" <${config.account.email}>`, // sender address
          to: email, // list of receivers
          subject: subject, // Subject line
          html: html, // html body
        });

        if (!_.isEmpty(info)) {
          resovle(true);
        }
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  static async validationEmail(email, message = "Vui lòng cung cấp một địa chỉ email hợp lệ") {
    try {
      const response = await validate({ email, validateSMTP: true });

      const { valid, reason, validators } = response;

      if (!valid && reason && !validators[reason].valid) {
        return Promise.reject(new APIError(400, message));
      }

      return valid;
    } catch (error) {
      console.log(`error validation:::`, error);
      Promise.reject(new APIError(500, error.message));
    }
  }
}

export default EmailService;
