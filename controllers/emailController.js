import { sendEmail } from "../services/emailService.js";

export const sendEmailHandler = async (req, res) => {
  try {
    await sendEmail(req.body);
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
};
