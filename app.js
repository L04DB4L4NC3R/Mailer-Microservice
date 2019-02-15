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
  if(req.file)
      emails=fs.readFileSync(path.join(__dirname,req.file.path), "utf8").split('\r\n')
  else emails=req.body.email.split(';')
  if(req.body.type=='text') isHtml=false
  else isHtml=true
  sendMail(emails,req.body.subject, isHtml, req.body.html,req.body.text).then(()=>{
    return res.render('contact',{msg:'email has been sent'});
  }).catch(()=>{
    return res.render('contact',{err:'email fail'});
  })

})
app.listen(3000,() => console.log("server started.."))
