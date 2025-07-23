import supabase from "../../../supabase/index.js";
import { sendEmail } from "../../../utils/mailer.js";
import { getRandomNumber } from "../../../utils/randomNumber.js";

export const resetPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email cannot be empty" });
  }

  const { data, error } = await supabase
    .from("clients")
    .select("name")
    .eq("email", email)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: "Email not found" });
  }

  const { name } = data;
  const otp = getRandomNumber();

  const body = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Password Reset</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f7;
          margin: 0;
          padding: 0;
        }
        .container {
          background-color: #ffffff;
          max-width: 600px;
          margin: 40px auto;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
        }
        .header h1 {
          color: #333333;
          font-size: 24px;
          margin-bottom: 0;
        }
        .message {
          color: #555555;
          font-size: 16px;
          line-height: 1.6;
        }
        .otp-box {
          background-color: #f0f0f0;
          color: #000000;
          font-size: 20px;
          font-weight: bold;
          text-align: center;
          padding: 15px;
          margin: 25px 0;
          border-radius: 6px;
          letter-spacing: 2px;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #888888;
          margin-top: 30px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="message">
          <p>Hello, ${name}</p>
          <p>We received a request to reset your password. Please use the following one-time password (OTP) to proceed:</p>
          <div class="otp-box">${otp}</div>
          <p>This OTP is valid for the next 10 minutes. If you did not request a password reset, please ignore this email or contact support.</p>
          <p>Thank you,<br />The Blood4U Team</p>
        </div>
        <div class="footer">
          &copy; 2025 Blood4U. All rights reserved.
        </div>
      </div>
    </body>
  </html>
  `;

  const mailLoad = {
    to: email,
    subject: "Reset Your Password",
    html: body,
  };

  try {
    await sendEmail(mailLoad);

    const { error: updateError } = await supabase
      .from("clients")
      .update({ code: otp })
      .eq("email", email);

    if (updateError) {
      return res.status(500).json({ error: "Failed to store OTP" });
    }

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Email sending failed", details: err.message });
  }
};
