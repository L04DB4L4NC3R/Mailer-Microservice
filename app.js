const express=require('express');
const bodyParser=require('body-parser');
const exphbs=require('express-handlebars');
const path=require('path');
var multer  = require('multer')
const nodemailer=require('nodemailer');
const fs=require('fs')
var upload = multer({ dest: 'uploads/' })
require('dotenv').config()
app = express();

// view engine setup
app.engine('handlebars',exphbs());
app.set('view engine','handlebars');

//static folder
app.use('/public',express.static(path.join(__dirname,'public')));

//bodyparser middleware

app.use(bodyParser.urlencoded({ extended: false }));


app.use(bodyParser.json());



app.get('/',(req,res)=>{

  res.render('contact');

});

app.post('/send',upload.single('files'),(req,res) => {
  if(req.file)
    emails=fs.readFileSync(path.join(__dirname,req.file.path), "utf8").split('\r\n')
  else emails=req.body.email.split(';')
  if(type='text') html=false
  else html=true
  console.log(req.file)
  console.log(req.body)
// const output=`
// <p> You have new contact request</p>
// <h3> Contact Details<h3>
// <ul>
// <li> Name:${req.body.name}</li>
// <li>Company:${req.body.company}</li>
// <li>Email:${req.body.email}</li>
// <li>phone:${req.body.phone}</li>
// </ul>
// <h3>Message<h3>
// ${req.body.message}


// `;
// async..await is not allowed in global scope, must use a wrapper
async function main(){

  let transporter = nodemailer.createTransport({
    service:'Gmail',
    auth: {
        user: 'sakshicls11@gmail.com', // generated ethereal user
        pass: process.env.password // generated ethereal password
    }
  });

  let mailOptions = {
      to: emails, // list of receivers
      subject:req.body.subject, // Subject line
      text: html?undefined:req.body.text, // plain text body
      html:html?req.body.html:undefined
  };


  let info = await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.log(error)
          return res.render('contact',{err:'email fail'});
      }
      console.log("Message sent: %s", info.messageId);
      return res.render('contact',{msg:'email has been sent'});
  });
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
main()
})
app.listen(3000,() => console.log("server started.."))
