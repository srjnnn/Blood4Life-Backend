import supabase from '../../../supabase/index.js';
import { sendEmail } from '../../../utils/mailer.js';
import { getRandomNumber } from '../../../utils/randomNumber.js';

export const signup = async (req, res) => {
  try {
    const { email, password, name, location, phone, gender } = req.body;

    // const { data, error } = await supabase.auth.signUp({ email, password });
    // Example: create a user with Supabase Admin API
const { data, error } = await supabase.auth.admin.createUser({
  email,
  email_confirm: true, 
  password,
});
    if (error) return res.status(400).json({ error: error.message });

    const userId = data.user.id;
    const code = getRandomNumber();

    const { error: tableError } = await supabase
      .from('clients')
      .insert([{
        uuid: userId,
        email,
        name,
        location,
        gender,
        phone,
        code: code,
      }]);

    if (tableError) {
      return res.status(500).json({ tableError});
    }

    const body = 
    `

    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Verify Your Account</title>
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
      background-color: #f4f6f8;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
    }
    .header {
      background-color: #2563eb;
      color: #ffffff;
      text-align: center;
      padding: 24px;
    }
    .header h1 {
      margin: 0;
      font-size: 22px;
    }
    .content {
      padding: 32px;
      line-height: 1.6;
    }
    .code-box {
      background-color: #f0f4ff;
      border: 1px dashed #2563eb;
      color: #1d4ed8;
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      padding: 16px;
      margin: 24px 0;
      letter-spacing: 2px;
      border-radius: 6px;
    }
    .footer {
      background-color: #f9fafb;
      text-align: center;
      padding: 20px;
      font-size: 12px;
      color: #777;
    }
    a.button {
      display: inline-block;
      background-color: #2563eb;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 600;
    }
  </style>
</head>
<body>

<div class="container">
  <div class="header">
    <h1>Welcome to Blood 4 U!</h1>
  </div>

  <div class="content">
    <p>Hi <strong>${name}</strong>,</p>

    <p>Your account has been successfully created. To complete your registration, please verify your account using the verification code below:</p>

    <div class="code-box">${code}</div>

    <p>This code will expire in <strong>10 minutes</strong>. If you did not sign up for Blood 4 U, please ignore this message.</p>

    <p>Need help? Just reply to this email or contact our support team anytime.</p>

    <p>Cheers, <br>The Blood 4 U Team</p>
  </div>

  <div class="footer">
    © 2025 Blood 4 U. All rights reserved.
  </div>
</div>

</body>
</html>


    `; 

    const mailLoad = {
      to: email,
      subject: "Verify Your Account",
      html: body,
    };

    await sendEmail(mailLoad);

    return res.status(201).json({
      message: 'User registered successfully. Please verify your email.',
      user: { id: userId, email },
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
