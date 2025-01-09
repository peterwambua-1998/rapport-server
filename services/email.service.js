const nodemailer = require("nodemailer");
const config = require("../config/config.config");
const { EmailTemplate, EmailConfiguration } = require("../models");

// Utility to replace placeholders in the email body
async function fetchAndRenderTemplate(type, variables) {
  const template = await EmailTemplate.findOne({ where: { type } });
  if (!template) throw new Error('Template not found');

  let body = template.body;
  for (const key in variables) {
    body = body.replace(`{{${key}}}`, variables[key]);
  }

  return { subject: template.subject, body };
}

const index = async () => {
  const emailConf = await EmailConfiguration.findOne({ where: { status: 1 } });

  let { host, port, secure, user, password } = conf.email;
  if (emailConf) {
    host = emailConf.password;
    port = emailConf.password;
    secure = emailConf.password;
    user = emailConf.password;
    password = emailConf.password;
  }

  console.log(host);


  return nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.secure,
    auth: {
      user: config.email.auth.user,
      pass: "Utah@2024#",
    },
  });
}

const transporter = nodemailer.createTransport({
  host: "mail.kodensolutions.com",
  port: 465,
  secure: true,
  auth: {
    user: "test@kodensolutions.com",
    pass: "Tester2025",
  },
});

// Function to send an email
const sendEmail = async (recipient, type, variables) => {
  try {
    const { subject, body } = await fetchAndRenderTemplate(type, variables);
    const mailOptions = {
      from: config.email.from,
      to: recipient,
      subject,
      html: body,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw new Error("Error sending email");
  }
};

module.exports = { sendEmail };
