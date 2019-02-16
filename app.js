const express=require('express');
const bodyParser=require('body-parser');
const exphbs=require('express-handlebars');
const path=require('path');
var multer  = require('multer')
const fs=require('fs')
var upload = multer({ dest: 'uploads/' })
require('dotenv').config()
app = express();
var {sendMail}=require('./service/mail')

app.engine('handlebars',exphbs());
app.set('view engine','handlebars');

app.use('/public',express.static(path.join(__dirname,'public')));

app.use(bodyParser.urlencoded({ extended: false }));


app.use(bodyParser.json());



app.get('/',(req,res)=>{

  res.render('contact');

});

app.post('/send',upload.single('files'),(req,res) => {
  if(req.body.type=='text') isHtml=false
  else isHtml=true

  if(req.file)
      fs.readFile(path.join(__dirname,req.file.path), "utf8",(emails)=>{
        emails=emails.split('\r\n')
        sendMail(emails,req.body.subject, isHtml, req.body.html,req.body.text).then(()=>{
          fs.unlinkSync(path.join(__dirname,req.file.path))
          return res.render('contact',{msg:'email has been sent'});
        }).catch(()=>{
          fs.unlinkSync(path.join(__dirname,req.file.path))
          return res.render('contact',{err:'email fail'});
        })
      })
  else {
    emails=req.body.email.split(';')
    sendMail(emails,req.body.subject, isHtml, req.body.html,req.body.text).then(()=>{
      return res.render('contact',{msg:'email has been sent'});
    }).catch(()=>{
      return res.render('contact',{err:'email fail'});
    })
  }
  
  

})
app.listen(3000,() => console.log("server started.."))
