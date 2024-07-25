const nodemailer = require("nodemailer");
const user = process.env.EMAIL_ADDRESS;
const pass = process.env.EMAIL_PASS;
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user, pass },
});
const sendEmail = async (to, subject, text) => {
  return transporter.sendMail({
    from: user,
    to,
    subject,
    text,
  });
};

const sendWelcomeEmail = async (to, username) => {
  const subject = `Welcome ${username} to Our Service!`;
  const welcomeText = `Thank you ${username} for signing up with us. We are excited to have you on board!`;
  await sendEmail(to, subject, welcomeText);
};
module.exports = {
  sendWelcomeEmail,
};
