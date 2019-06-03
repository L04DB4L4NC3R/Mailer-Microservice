
const nodemailer = require('nodemailer');
const fs = require('fs');

module.exports.sendMail = (emails, subject, isHtml, html, text, attachments) => new Promise((resolve, reject) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.email,
      pass: process.env.password,
    },
  });

  const mailOptions = {
    to: emails, // list of receivers
    subject, // Subject line
    text: isHtml ? undefined : text, // plain text body
    html: isHtml ? html : undefined,
    attachments,
  };


  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return reject();
    }
    resolve();
  });
});
