const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
var multer = require('multer')
const fs = require('fs')
var upload = multer({ dest: 'uploads/' })
require('dotenv').config()
app = express();
var { sendMail } = require('./service/mail')

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));


app.use(bodyParser.json());



app.get('/', (req, res) => {

  res.render('contact');

  
});

app.post('/send', upload.fields([{ name: 'csv' }, { name: 'attachment' }]), (req, res) => {
  // console.log(req.files.csv[0])
  console.log(req.files)
  if (req.body.type == 'text') isHtml = false
  else isHtml = true

  var attachment = []
  if (req.files && req.files.attachment && req.files.attachment.constructor == Array)
    req.files.attachment.forEach(att => {
      attachment.push({
        contentType: att.mimetype,
        path: path.join(__dirname, att.path),
        filename: att.originalname
      })
    });


  console.log(attachment)
  console.log(path.join(__dirname, req.files.csv[0].path))
  if (req.files && req.files.csv && req.files.csv[0])
    fs.readFile(path.join(__dirname, req.files.csv[0].path), "utf8", (err,emails) => {
      emails = emails.split('\r\n')
      sendMail(emails, req.body.subject, isHtml, req.body.html, req.body.text, attachment).then(() => {
        fs.unlinkSync(path.join(__dirname, req.files.csv[0].path))
        return res.render('contact', { msg: 'email has been sent' });
      }).catch(() => {
        fs.unlinkSync(path.join(__dirname, req.files.csv[0].path))
        return res.render('contact', { err: 'email fail' });
      })
    })
  else {
    emails = req.body.email.split(';')
    sendMail(emails, req.body.subject, isHtml, req.body.html, req.body.text, attachment).then(() => {
      return res.render('contact', { msg: 'email has been sent' });
    }).catch(() => {
      return res.render('contact', { err: 'email fail' });
    })
  }



})
app.listen(9000, () => console.log("server started.."))
