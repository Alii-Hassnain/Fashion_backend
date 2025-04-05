const nodemailer = require("nodemailer");
const { verification_Email_Template ,orderConfirmationTemplate} = require("../utils/emailTemplate");
require("dotenv").config(); // Load environment variables from .env

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_NAME,
    pass: process.env.EMAIL_PASSWORD,
  },
  logger: true, // Enable logging
  // debug: true, // Enable debug output
});

const sendEmail = async (email, type, username, link,data) => {
  try {
    let subject = "",
      text = "",
      html = "";
    if (type === "verify") {
      subject = "Hello ✔ Verify your email";
      text = "verify your email";
      html = verification_Email_Template.replace("{verificationCode}", link);
    } else if (type === "forgot") {
      subject = "Hello ✔ Reset your password";
      text = "reset your password";
      html = `
      <h3>Hello ${username || "User"},</h3>
      <p>You requested to reset your password. Click the link below to reset it:</p>
      <a href="${link}" style="color: blue;">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
    `;
    }
    else if (type === "order") {
      subject = "🎉 Order Confirmation - FashionVista";
      html = orderConfirmationTemplate(
      data.customerName,
      data.orderId,
      data.totalPrice,
      data.paymentStatus,
      data.trackingLink,
      data.storeName,
      data.supportEmail,
      data.phoneNumber)
    } 
     else {
      throw new Error("Invalid email type");
    }

    await transporter.sendMail({
      from: '"FashionShop 😎👻" <fashionshopfyp@gmail.com>', // sender address
      to: email, // sender address
      subject,
      html,
    });
    console.log(`email send successfully to ${email}`);
    return true;
  } catch (error) {
    console.log("error in sending mail : ", error);
    return false;
  }
};

module.exports = sendEmail;
