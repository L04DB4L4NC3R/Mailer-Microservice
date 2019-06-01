const nodemailer = require('nodemailer');
const fs = require('fs');

module.exports.sendMail = (emails, subject, isHtml, html, text, attachments) => {
  console.log({
    user: process.env.email,
    pass: process.env.password,
  });
  return new Promise((resolve, reject) => {
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
      if (attachments.length > 0) {
        attachments.forEach((att) => {
          fs.unlinkSync(att.path);
        });
      }
      if (error) {
        console.log(error);
        return reject();
        //   return res.render('contact',{err:'email fail'});
      }
      resolve();
      //   return res.render('contact',{msg:'email has been sent'});
    });
  });
};
