const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "aftabkh5001@gmail.com",
    pass: "zwgcmrerulsptvuu",
  },
});

const mailOptions = {
  from: "aftabkh5001@gmail.com", // sender address
  to: "", // list of receivers
  subject: "Subject of your email", // Subject line
  html: "<p>Your html here</p>", // plain text body
};

const sendMail = (mailData) => {
  mailOptions.to = mailData.to;
  mailOptions.subject = mailData.subject;
  mailOptions.html = mailData.html;

  // if attachments is present
  if (mailData.attachments) {
    mailOptions.attachments = mailData.attachments;
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = {
  sendMail,
};
