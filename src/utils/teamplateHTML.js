import { format } from "date-fns";
import vi from "date-fns/locale/vi/index.js";

function formatDateVN(date) {
  return format(new Date(date), "E P", {
    locale: vi,
  });
}

function ressetPassword({ lastName, REDIRECT_URL }) {
  return `
  <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:37.5em;background-color:#ffffff;border:1px solid #f0f0f0;padding:45px">
  <tbody>
    <tr style="width:100%">
      <td>
        <img alt="Dropbox" src="https://react-email-demo-92trk6dwg-resend.vercel.app/static/dropbox-logo.png" width="40" height="33" style="display:block;outline:none;border:none;text-decoration:none">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
          <tbody>
            <tr>
              <td>
                <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">Hi ${lastName},</p>
                <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">Gần đây ai đó đã yêu cầu thay đổi mật khẩu cho tài khoản Booking Hotel của bạn. Nếu đây là bạn, bạn có thể đặt mật khẩu mới tại đây:</p><a href="${REDIRECT_URL}" target="_blank" style="background-color:#007ee6;border-radius:4px;color:#fff;font-family:'Open Sans', 'Helvetica Neue', Arial;font-size:15px;text-decoration:none;text-align:center;display:inline-block;width:210px;padding:0px 0px;line-height:100%;max-width:100%"><span><!--[if mso]><i style="letter-spacing: undefinedpx;mso-font-width:-100%;mso-text-raise:0" hidden>&nbsp;</i><![endif]--></span><span style="background-color:#007ee6;border-radius:4px;color:#fff;font-family:'Open Sans', 'Helvetica Neue', Arial;font-size:15px;text-decoration:none;text-align:center;display:inline-block;width:210px;padding:14px 7px;max-width:100%;line-height:120%;text-transform:none;mso-padding-alt:0px;mso-text-raise:0">Thay đổi mật khẩu</span><span><!--[if mso]><i style="letter-spacing: undefinedpx;mso-font-width:-100%" hidden>&nbsp;</i><![endif]--></span></a>
                <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">Nếu bạn không muốn thay đổi mật khẩu của mình hoặc không yêu cầu điều này, chỉ cần bỏ qua và xóa thông báo này.</p>
                <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">Xin cảm ơn!</p>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
  `;
}

function fPrice(number) {
  return number.toLocaleString("it-IT", { style: "currency", currency: "VND" });
}

function billHTML({
  data = [],
  hotel = {},
  customer = "",
  note = "",
  payment = "OFFLINE",
  bookingFor = "ME",
  userBooking = "",
  billId = "",
  totalNight = 1,
  time_destination = "",
  startDate,
  endDate,
}) {
  return `
  <!DOCTYPE html
  PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html lang="en">

  <head>
  <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
  </head>
  <div id="__react-email-preview" style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">
  Get your order summary, estimated delivery date and more<div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿
    ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿
    ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿
    ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿
    ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿
    ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿
    ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿</div>
  </div>

  <body
  style="background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif">
  <table align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0" width="100%"
    style="max-width:37.5em;margin:10px auto;width:600px;border:1px solid #E5E5E5">
    <tr style="width:100%">
      <td>
        <table style="padding:22px 40px;background-color:#F7F7F7" align="center" border="0" cellPadding="0"
          cellSpacing="0" role="presentation" width="100%">
          <tbody>
            <tr>
              <td>
                <table width="100%" align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0">
                  <tbody style="width:100%">
                    <tr style="width:100%">
                      <td>
                        <p style="font-size:14px;line-height:2;margin:0;font-weight:bold">Mã số hóa đơn</p>
                        <p style="font-size:14px;line-height:1.4;margin:12px 0 0 0;font-weight:500;color:#6F6F6F">${billId}</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
        <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#E5E5E5;margin:0" />
        <table style="padding:40px 74px;text-align:center" align="center" border="0" cellPadding="0" cellSpacing="0"
          role="presentation" width="100%">
          <tbody>
            <tr>
              <td><img alt="Nike" src="https://react-email-demo-5x1tg9zg2-resend.vercel.app/static/nike-logo.png"
                  width="66" height="22"
                  style="display:block;outline:none;border:none;text-decoration:none;margin:auto" />
                <h1 style="font-size:32px;line-height:1.3;font-weight:700;text-align:center;letter-spacing:-1px">Chi
                  tiết về đặt phòng</h1>
                <p style="font-size:14px;line-height:2;margin:0;color:#747474;font-weight:500">Cảm ơn bạn đã đặt phòng
                </p>
                <p style="font-size:14px;line-height:2;margin:0;color:#747474;font-weight:500;margin-top:24px">Chúng tôi
                  gửi e-mail này bởi vì bạn đã đặt phòng trên hệ thống booking.endcool của chúng tôi</p>
              </td>
            </tr>
          </tbody>
        </table>
        <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#E5E5E5;margin:0" />
        <table style="padding-left:40px;padding-right:40px;padding-top:22px;padding-bottom:22px" align="center"
          border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
          <tbody>
            <tr>
              <td>
                <p style="font-size:15px;line-height:2;margin:0;">Người đặt: <strong>${userBooking}</strong></p>
                <p style="font-size:15px;line-height:2;margin:0;">Đặt cho: <strong>${
                  bookingFor !== "ME" ? "Người khác" : "Chính bạn"
                }</strong></p>
                ${
                  customer &&
                  `<p style="font-size:15px;line-height:2;margin:0;">Khách hàng: <strong>${customer}</strong></p>`
                }
                <p style="font-size:15px;line-height:2;margin:0;">Khách sạn: <strong>${
                  hotel.hotel_name
                }</strong></p>
                <p style="font-size:14px;line-height:2;margin:0;color:#747474;font-weight:500">${
                  hotel.hotel_address
                }</p>

                <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#E5E5E5;margin:0" />

                <p style="font-size:15px;line-height:2;margin:0;">Số đêm nghỉ: <strong>${totalNight} đêm</strong></p>
                <p style="font-size:15px;line-height:2;margin:0;">Ngày nhận phòng: <strong>${formatDateVN(
                  startDate
                )}</strong></p>
                <p style="font-size:15px;line-height:2;margin:0;">Ngày trả phòng: <strong>${formatDateVN(
                  endDate
                )}</strong></p>
                <p style="font-size:15px;line-height:2;margin:0;">Thời gian nhận phòng: <strong>${
                  time_destination || "13:00 – 14:00"
                }</strong></p>
                <p style="font-size:15px;line-height:2;margin:0;">Tổng giá: <strong>${fPrice(
                  hotel.total_price
                )}</strong><i style="color:red;">(* Đã bao gồm thuế 10%)</i></p>
                <p style="font-size:15px;line-height:2;margin:0;">Hình thức thanh toán: <strong>${
                  payment === "OFFLINE" ? "Tại kì nghỉ" : "Hình thức online"
                }</strong></p>
                <p style="font-size:15px;line-height:2;margin:0;font-style:italic;color:red;">${
                  payment === "OFFLINE" ? "Chưa thanh toán" : "Đã thanh toán"
                }</p>
                <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#E5E5E5;margin:0" />
                <p style="font-size:15px;line-height:2;margin:0;">Ghi chú: <strong>${
                  note || " Không có ghi chú"
                }</strong></p>
              </td>
            </tr>
          </tbody>
        </table>
        <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#E5E5E5;margin:0" />
        <table style="padding-left:40px;padding-right:40px;padding-top:40px;padding-bottom:40px" align="center"
          border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
          <tbody>
            <tr>
              <td>
                <table width="100%" align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0">
                  <tbody style="width:100%">
                   ${data
                     .map(
                       (item, index) =>
                         `
                       <tr style="width:100%">
                         <td style="vertical-align:top;padding-left:12px">
                           <p style="font-size:14px;line-height:2;margin:0;font-weight:500">
                             Mã phòng: <strong>${item.room_id}</strong>
                           </p>
                           <p style="font-size:14px;line-height:2;margin:0;font-weight:500">
                             Tên phòng: <strong>${item.room_name}</strong>
                           </p>
                           <p style="font-size:14px;line-height:2;margin:0;font-weight:500">
                             Số lượng phòng đã đặt: <strong>${
                               item.booking_room
                             }</strong>
                           </p>
                           <p style="font-size:14px;line-height:2;margin:0;font-weight:500">
                             Giá: <strong>${fPrice(item.booking_price)}</strong>
                           </p>
                         </td>
                       </tr>
                       `
                     )
                     .join("")}
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
        <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#E5E5E5;margin:0" />
  </body>

  </html>
  `;
}

function verifyOtpTeamplate(otp) {
  return `
  <body style="background-color:#ffffff;margin:0 auto;font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif">
    <table align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0" width="100%" style="max-width:600px;margin:0 auto">
      <tr style="width:100%">
        <td>
          <h1 style="color:#1d1c1d;font-size:36px;font-weight:700;margin:30px 0;padding:0;line-height:42px">Xác nhận địa chỉ email</h1>
          <p style="font-size:20px;line-height:28px;margin:16px 0;margin-bottom:30px">Mã xác nhận của bạn ở bên dưới - hãy nhập mã đó vào cửa sổ trình duyệt đang mở của bạn là đã hoàn thành đăng ký.</p>
          <table style="background:rgb(245, 244, 245);border-radius:4px;margin-right:50px;margin-bottom:30px;padding:43px 23px" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
            <tbody>
              <tr>
                <td>
                  <p style="font-size:30px;line-height:24px;margin:16px 0;text-align:center;vertical-align:middle">${otp}</p>
                </td>
              </tr>
            </tbody>
          </table>
          <p style="font-size:14px;line-height:24px;margin:16px 0;color:#000">Nếu bạn không yêu cầu email này, thì không có gì phải lo lắng - bạn có thể yên tâm bỏ qua nó.</p>
        </td>
      </tr>
    </table>
  </body>
  `;
}

export { ressetPassword, billHTML, fPrice, verifyOtpTeamplate };
