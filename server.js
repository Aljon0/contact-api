// 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
// jcff linq brmn zvfa
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import nodemailer from "nodemailer";

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

// Personal information to include in AI prompts
const personalContext = `
Al-Jon is a developer with skills in React, Node.js, Vue.js, Express, and has security experience 
including Penetration Testing and Authentication Systems. He's worked on projects including 
an E-Commerce Platform, Security Dashboard, Portfolio Website, and Task Management App.
He's based in General Trias, Cavite, Philippines and can be contacted at aljon.media0@gmail.com
or by phone at +63 906 920 8512.
`;

// API endpoint for chatbot
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    
    // Format the prompt with your personal information context
    const prompt = `
The following is information about Al-Jon:
${personalContext}

Based on the above information about Al-Jon, please respond helpfully to this message:
"${message}"

Keep your response conversational, friendly, and concise.
`;
    
    // Call Hugging Face Inference API
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill',
      { inputs: prompt },
      { 
        headers: { 
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        } 
      }
    );
    
    // Process the response from Hugging Face
    let botResponse = '';
    if (response.data && response.data[0] && response.data[0].generated_text) {
      botResponse = response.data[0].generated_text.trim();
      
      // Clean up the response if needed (some models might include the input in the response)
      if (botResponse.includes(prompt)) {
        botResponse = botResponse.replace(prompt, '').trim();
      }
    } else {
      botResponse = "I'm sorry, I couldn't process your request. Please try again.";
    }
    
    // Send response back to client
    res.json({ response: botResponse });
  } catch (error) {
    console.error('Error with chatbot API:', error);
    
    // If Hugging Face API fails, use fallback responses
    const lowerInput = req.body.message.toLowerCase();
    let fallbackResponse = "";
    
    if (lowerInput.includes("project") || lowerInput.includes("work")) {
      fallbackResponse = "Al-Jon has worked on several projects, including an E-Commerce Platform, Security Dashboard, Portfolio Website, and Task Management App. All of these are built with React, Node.js, and Tailwind CSS.";
    } else if (lowerInput.includes("skill") || lowerInput.includes("tech")) {
      fallbackResponse = "Al-Jon's technical expertise spans across multiple domains of web development and security. He works with technologies like React, Node.js, Vue.js, Express, and has security experience including Penetration Testing and Authentication Systems.";
    } else if (lowerInput.includes("contact") || lowerInput.includes("email") || lowerInput.includes("reach")) {
      fallbackResponse = "You can contact Al-Jon via email at aljon.media0@gmail.com or by phone at +63 906 920 8512. He's based in General Trias, Cavite, Philippines.";
    } else if (lowerInput.includes("location") || lowerInput.includes("based") || lowerInput.includes("live")) {
      fallbackResponse = "Al-Jon is based in General Trias, Cavite, Philippines.";
    } else if (lowerInput.includes("hello") || lowerInput.includes("hi") || lowerInput.includes("hey")) {
      fallbackResponse = "Hello! I'm Al-Jon's virtual assistant. How can I help you today?";
    } else if (lowerInput.includes("background") || lowerInput.includes("experience")) {
      fallbackResponse = "Al-Jon has a background in both development and security. He brings a unique perspective to projects, ensuring they're not only functional but also user-friendly and secure.";
    } else {
      fallbackResponse = "Thanks for your message. I'm Al-Jon's virtual assistant. If you have questions about his projects, skills, or would like to get in touch, feel free to ask!";
    }
    
    res.json({ response: fallbackResponse });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});