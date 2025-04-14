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

// Enhanced personal information to include in AI prompts
const personalContext = `
Al-Jon is a developer with skills in React, Node.js, Vue.js, Express, and has security experience 
including Penetration Testing and Authentication Systems. He's worked on projects including 
an E-Commerce Platform, Security Dashboard, Portfolio Website, and Task Management App.
He's based in General Trias, Cavite, Philippines and can be contacted at aljon.media0@gmail.com
or by phone at +63 906 920 8512.

Recent Projects:
- "Eternal Design": A 3D customization platform for gravestones that allows users to visualize designs in 3D, 
customize their own or select from templates, place orders, and communicate with the business owner. 
Al-Jon built this full system using React.js, Three.js, Tailwind CSS, and Firebase for authentication, 
database, and real-time features. He worked as the full-stack developer managing both frontend and backend, 
despite it being his first time using both React.js and Three.js simultaneously.

Tech Stack Preferences:
Al-Jon is most comfortable with React.js and Tailwind CSS on the frontend, and Express.js with Firebase 
on the backend. His favorite stack is FERN — Firebase, Express, React, and Node. He's especially fond of 
Firebase because it's a NoSQL database that's secure, scalable, and developer-friendly. He also works with 
MongoDB, Supabase, and Appwrite. While capable of full-stack development, he leans more toward backend 
development, enjoying the creation of secure, fast, and scalable APIs.

Development Approach:
Al-Jon identifies more as a backend developer because he enjoys working with logic, structure, and 
functionality. He can handle frontend work but typically needs a reference or wireframe for UI design. 
He's fully capable of full-stack work but thrives more on the backend side.

Handling Pressure and Deadlines:
When under pressure, Al-Jon breaks tasks into smaller parts with mini-deadlines, prioritizing the most 
important features first. He stays focused by avoiding distractions and adjusting his schedule when 
necessary. He values transparent communication with team members or supervisors about challenges. 
During his 3D gravestone project, he successfully met deadlines despite learning new technologies by 
setting daily goals and maintaining consistency.

Additional Skills and Experience:
- Proficient in building secure authentication systems
- Skilled in analyzing and solving problems
- Skilled in developing e-commerce platforms
- Capable of creating responsive and user-friendly interfaces
- Strong problem-solving abilities and adaptability to new technologies
`;

// API endpoint for chatbot
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    // Format the prompt with the enhanced personal information context
    const prompt = `
You are an AI assistant for Al-Jon, a web developer. You should act as if you are representing Al-Jon when 
talking to potential recruiters or clients. Respond in first person as if you are Al-Jon himself.

The following is detailed information about Al-Jon:
${personalContext}

A recruiter or potential client has sent this message:
"${message}"

Respond conversationally and professionally as if you are Al-Jon. Be specific about projects, technologies, 
and experiences when relevant. Keep your responses friendly, confident but humble, and tailored to what a 
recruiter would want to know. If asked about availability for interviews or start dates, express flexibility 
and enthusiasm. For technical questions, demonstrate depth of knowledge but avoid being overly technical 
unless specifically asked.
`;

    // Call Hugging Face Inference API
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill",
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Process the response from Hugging Face
    let botResponse = "";
    if (response.data && response.data[0] && response.data[0].generated_text) {
      botResponse = response.data[0].generated_text.trim();

      // Clean up the response if needed (some models might include the input in the response)
      if (botResponse.includes(prompt)) {
        botResponse = botResponse.replace(prompt, "").trim();
      }
    } else {
      botResponse =
        "I'm sorry, I couldn't process your request. Please try again.";
    }

    // Send response back to client
    res.json({ response: botResponse });
  } catch (error) {
    console.error("Error with chatbot API:", error);

    // Enhanced fallback responses for recruiters
    const lowerInput = req.body.message.toLowerCase();
    let fallbackResponse = "";

    if (
      lowerInput.includes("project") ||
      lowerInput.includes("work") ||
      lowerInput.includes("recent")
    ) {
      fallbackResponse =
        "One of my recent projects is 'Eternal Design', a 3D customization platform for gravestones. I built the entire system using React.js, Three.js, Tailwind CSS, and Firebase. Users can visualize designs in 3D, customize their own or choose from templates, place orders, and chat with the business owner. It was challenging as it was my first time using both React and Three.js, but I managed to deliver a fully functional system by breaking down the work and staying consistent.";
    } else if (
      lowerInput.includes("tech stack") ||
      lowerInput.includes("comfortable") ||
      lowerInput.includes("technologies")
    ) {
      fallbackResponse =
        "I'm most comfortable working with React.js and Tailwind CSS on the frontend, and Express.js with Firebase on the backend. My favorite stack is FERN — Firebase, Express, React, and Node. I especially like Firebase for its NoSQL approach, security features, and scalability. While I can handle both frontend and backend, I lean more towards backend development where I enjoy building secure, fast, and scalable APIs.";
    } else if (
      lowerInput.includes("frontend") ||
      lowerInput.includes("backend") ||
      lowerInput.includes("full stack")
    ) {
      fallbackResponse =
        "I identify more as a backend developer because I love working with logic, structure, and functionality. Seeing a system I built working seamlessly really amazes me. While I can handle frontend work, I typically need a reference or wireframe for UI design. I'm fully capable of working on both ends of a project — I just thrive more on the backend side where the system's core logic lives.";
    } else if (
      lowerInput.includes("deadline") ||
      lowerInput.includes("pressure") ||
      lowerInput.includes("challenge")
    ) {
      fallbackResponse =
        "When under pressure or facing tight deadlines, I break tasks into smaller, manageable parts with mini-deadlines for each. I prioritize the most important features first and stay focused by avoiding distractions. During my 3D gravestone project, I was learning both React and Three.js for the first time, which was challenging. I overcame this by setting daily goals, asking questions when needed, and maintaining consistency — which helped me meet the deadline successfully.";
    } else if (
      lowerInput.includes("contact") ||
      lowerInput.includes("email") ||
      lowerInput.includes("reach")
    ) {
      fallbackResponse =
        "You can reach me at aljon.media0@gmail.com or by phone at +63 906 920 8512. I'm based in General Trias, Cavite, Philippines, and I'm usually quick to respond to emails and messages. I'd be happy to discuss potential opportunities or answer any additional questions you might have.";
    } else if (
      lowerInput.includes("location") ||
      lowerInput.includes("based") ||
      lowerInput.includes("remote")
    ) {
      fallbackResponse =
        "I'm based in General Trias, Cavite, Philippines. I'm comfortable working remotely and have experience collaborating with distributed teams. I maintain consistent communication and am adaptable to different time zones when necessary.";
    } else if (
      lowerInput.includes("hello") ||
      lowerInput.includes("hi") ||
      lowerInput.includes("hey")
    ) {
      fallbackResponse =
        "Hello! Thanks for reaching out. I'm Al-Jon, a full-stack developer with a preference for backend development. I specialize in React.js, Node.js, Express, and Firebase. I'd be happy to discuss how my skills and experience might be a good fit for your team or project. What would you like to know about my background or capabilities?";
    } else if (
      lowerInput.includes("experience") ||
      lowerInput.includes("background") ||
      lowerInput.includes("skills")
    ) {
      fallbackResponse =
        "I have experience in development, with skills in React, Node.js, Express, and security practices including authentication systems. I've built various projects including an e-commerce platform, a Client & project management dashboard, and most recently, a 3D customization platform for gravestones using React.js, Three.js, and Firebase. I'm particularly strong in backend development and enjoy creating secure, scalable APIs.";
    } else if (
      lowerInput.includes("interview") ||
      lowerInput.includes("available") ||
      lowerInput.includes("when")
    ) {
      fallbackResponse =
        "I'm currently available for interviews and discussions about potential opportunities. My schedule is fairly flexible, and I can make time for important conversations about exciting projects or roles. Just let me know what times work well for you, and I'll do my best to accommodate. I'm also open to discussing start dates and can be available relatively soon for the right opportunity.";
    } else {
      fallbackResponse =
        "Thank you for your message. I'm Al-Jon, a full-stack developer with a focus on React.js, Node.js, Express.js and Firebase. I recently completed a 3D customization platform and have experience in e-commerce, security systems, and web application development. I'd be happy to discuss my experience, projects, or how I might contribute to your team. Feel free to ask me anything specific about my technical skills or background.";
    }

    res.json({ response: fallbackResponse });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
