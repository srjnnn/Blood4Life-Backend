import nodemailer from "nodemailer";

export const sendEmail = async (req, res) => {
  try {
    const { emails, subject, body } = req.body;

    if (!emails || !Array.isArray(emails) || emails.length === 0 || !subject || !body) {
      return res.status(400).json({ success: false, message: "Emails (array), subject, and body are required" });
    }
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emails.join(","),
      subject,
      html: body,
    };

    const info = await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: "Email(s) sent", info });
  } catch (error) {
    console.error("Error sending email:", error.message);
    return res.status(500).json({ success: false, message: "Failed to send email" });
  }
};