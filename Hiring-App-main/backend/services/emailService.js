const { google } = require("googleapis");
const nodemailer = require("nodemailer");
require("dotenv").config();

// ✅ OAuth2 Setup for Google Calendar API
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// ✅ Set Credentials
oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
oauth2Client.getAccessToken()
  .then((token) => console.log("✅ Access Token:", token))
  .catch((error) => console.error("❌ Invalid Refresh Token:", error));

// ✅ Google Calendar API Instance
const calendar = google.calendar({ version: "v3", auth: oauth2Client });

// ✅ Function to Schedule Interview and Generate Google Meet Link
const scheduleInterview = async (candidateEmail, candidateName, jobRole) => {
  try {
    const event = {
      summary: `Interview for ${jobRole}`,
      description: `Interview with ${candidateName} for the ${jobRole} position.`,
      start: {
        dateTime: "2025-03-25T09:00:00Z", // Interview Date & Time
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: "2025-03-25T09:30:00Z", // 30-minute interview
        timeZone: "Asia/Kolkata",
      },
      attendees: [{ email: candidateEmail }],
      conferenceData: {
        createRequest: {
          requestId: `interview-${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    };

    // 🔹 Insert Event into Google Calendar
    const eventResponse = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1,
    });

    console.log(`✅ Interview Scheduled: ${eventResponse.data.hangoutLink}`);
    return eventResponse.data.hangoutLink;
  } catch (error) {
    console.error("❌ Failed to schedule interview:", error);
    return null;
  }
};

// ✅ Configure Nodemailer for Gmail SMTP with OAuth2
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.SMTP_EMAIL,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// ✅ Function to Send Email with Google Meet Link
const sendEmail = async (recipientEmail, candidateName, jobRole) => {
  try {
    const meetingLink = await scheduleInterview(recipientEmail, candidateName, jobRole);

    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: recipientEmail,
      subject: "🎉 You Are Shortlisted for the Job Role!",
      text: `Dear ${candidateName},

      Congratulations! You have been shortlisted for the position of ${jobRole}. 
      Our team has scheduled an interview on 25th March at 9:00 AM.

      Join the meeting by clicking the link below:
      ${meetingLink ? meetingLink : "Google Meet link could not be generated."}

      Best Regards,  
      Hiring Team`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${recipientEmail}`);
    return { success: true, message: `Email sent to ${recipientEmail}` };
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    return { success: false, message: "Failed to send email" };
  }
};

module.exports = sendEmail;
