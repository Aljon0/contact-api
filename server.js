// jcff linq brmn zvfa
import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Create a transporter object
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use other services like 'SendGrid', 'Mailgun', etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// API endpoint for sending emails
app.post("/api/send-email", async (req, res) => {
  console.log(req.body);
  const { from_name, reply_to, subject, message } = req.body;

  try {
    // Email options
    const mailOptions = {
      from: `${from_name} <${reply_to}>`, // Sender's email address
      to: process.env.EMAIL_USER, // Your receiving email address
      subject: `${subject}`,
      html: `
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
`,
      replyTo: reply_to,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({
          success: false,
          message: "Failed to send email. Please try again later.",
        });
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res
      .status(200)
      .json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send email. Please try again later.",
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
