const nodemailer = require('nodemailer');

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send Email Function
const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: options.email,
      subject: options.subject,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Error sending email: ${error.message}`);
    throw error;
  }
};

// Email Templates
const emailTemplates = {
  // Welcome Email
  welcome: (userName) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
        <h1 style="color: #ff6b6b;">Welcome to ShakyTails! 🐾</h1>
        <p>Hi ${userName},</p>
        <p>Thank you for joining ShakyTails - the premium pet ID tag system that keeps your furry friends safe!</p>
        <p>You can now create pet profiles, generate QR codes, and keep track of vaccinations.</p>
        <p>Best regards,<br>The ShakyTails Team</p>
      </div>
    </div>
  `,

  // Password Reset Email
  resetPassword: (resetUrl) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
        <h1 style="color: #ff6b6b;">Password Reset Request</h1>
        <p>You requested a password reset for your ShakyTails account.</p>
        <p>Click the button below to reset your password:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 30px; background-color: #ff6b6b; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Reset Password</a>
        <p>This link will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>The ShakyTails Team</p>
      </div>
    </div>
  `,

  // Pet Lost Alert
  petLost: (petName, petImage) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
        <h1 style="color: #ff6b6b;">🚨 Pet Marked as LOST</h1>
        <p><strong>${petName}</strong> has been marked as lost.</p>
        ${petImage ? `<img src="${petImage}" alt="${petName}" style="max-width: 300px; border-radius: 10px; margin: 20px 0;">` : ''}
        <p>Don't worry! Anyone who scans your pet's QR code will be able to contact you immediately.</p>
        <p>We'll notify you as soon as someone reports finding ${petName}.</p>
        <p>Stay hopeful,<br>The ShakyTails Team</p>
      </div>
    </div>
  `,

  // Pet Found Notification
  petFound: (petName, finderLocation, finderMessage, finderContact) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
        <h1 style="color: #4caf50;">🎉 Great News! Someone Found ${petName}!</h1>
        <p><strong>Location:</strong> ${finderLocation}</p>
        <p><strong>Message:</strong> ${finderMessage}</p>
        <p><strong>Contact:</strong> ${finderContact}</p>
        <p>Please reach out to the finder immediately to reunite with ${petName}!</p>
        <p>We're so happy to help bring you together! 🐾</p>
        <p>Best regards,<br>The ShakyTails Team</p>
      </div>
    </div>
  `,

  // Vaccination Reminder
  vaccineReminder: (petName, vaccineName, dueDate) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
        <h1 style="color: #ff6b6b;">💉 Vaccination Reminder</h1>
        <p>This is a friendly reminder that <strong>${petName}</strong> is due for vaccination:</p>
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Vaccine:</strong> ${vaccineName}</p>
          <p style="margin: 5px 0;"><strong>Due Date:</strong> ${dueDate}</p>
        </div>
        <p>Please schedule an appointment with your veterinarian.</p>
        <p>Keeping ${petName} healthy,<br>The ShakyTails Team</p>
      </div>
    </div>
  `,
};

module.exports = {
  sendEmail,
  emailTemplates,
};
