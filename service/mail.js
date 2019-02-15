const nodemailer=require('nodemailer');

module.exports={
    sendMail: function (emails,subject, isHtml, html,text){
        return new Promise((resolve,reject)=>{
            let transporter = nodemailer.createTransport({
                service:'Gmail',
                auth: {
                    user: process.env.email, 
                    pass: process.env.password
                }
              });
            
              let mailOptions = {
                  to: emails, // list of receivers
                  subject:subject, // Subject line
                  text: isHtml?undefined:text, // plain text body
                  html:isHtml?html:undefined
              };
            
            
              transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                      console.log(error)
                      reject()
                    //   return res.render('contact',{err:'email fail'});
                  }
                  resolve()
                //   return res.render('contact',{msg:'email has been sent'});
              });
        })
    }
}