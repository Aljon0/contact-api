import transporter from "../config/mailer.js";
import config from "../config/index.js";

export const sendEmail = async (emailData) => {
  const { from_name, reply_to, subject, message } = emailData;

  const mailOptions = {
    from: `${from_name} <${reply_to}>`,
    to: config.EMAIL_USER,
    subject: `${subject}`,
    html: generateEmailTemplate(from_name, reply_to, subject, message),
    replyTo: reply_to,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};

function generateEmailTemplate(from_name, reply_to, subject, message) {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
    }
    .container {
      border: 1px solid #e1e1e1;
      border-radius: 5px;
      padding: 20px;
      background-color: #f9f9f9;
    }
    .header {
      background-color: #4a5568;
      color: white;
      padding: 15px;
      border-radius: 5px 5px 0 0;
      margin: -20px -20px 20px -20px;
    }
    .content {
      background-color: white;
      padding: 20px;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .field {
      margin-bottom: 15px;
    }
    .label {
      font-weight: bold;
      color: #4a5568;
    }
    .message-box {
      background-color: #f1f5f9;
      border-left: 4px solid #4a5568;
      padding: 15px;
      margin-top: 5px;
    }
    .footer {
      margin-top: 20px;
      font-size: 12px;
      color: #666;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin: 0;">New Contact Form Submission</h2>
    </div>
    <div class="content">
      <div class="field">
        <span class="label">Name:</span> ${from_name}
      </div>
      <div class="field">
        <span class="label">Email:</span> <a href="mailto:${reply_to}">${reply_to}</a>
      </div>
      <div class="field">
        <span class="label">Subject:</span> ${subject}
      </div>
      <div class="field">
        <span class="label">Message:</span>
        <div class="message-box">${message}</div>
      </div>
    </div>
    <div class="footer">
      This is an automated message from your contact form.
    </div>
  </div>
</body>
</html>
`;
}
