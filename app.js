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
  if(req.body.type=='text') html=false
  else html=true
  console.log(req.file)
  console.log(req.body)

async function main(){

  let transporter = nodemailer.createTransport({
    service:'Gmail',
    auth: {
        user: process.env.email, 
        pass: process.env.password
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
