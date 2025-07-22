import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, html }) => {
  if (!to || !subject || !html) {
    throw new Error('Missing required fields: to, subject, or html');
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
    to: Array.isArray(to) ? to.join(',') : to,
    subject,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};
