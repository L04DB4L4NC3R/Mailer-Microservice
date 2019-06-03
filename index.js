const express = require('express');
const bodyParser = require('body-parser');

app = express();

require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH, OPTIONS');
  next();
});


app.use('/template', require('./routes/template.js'));
app.use('/qr', require('./routes/qr.js'));
app.use('/attachment', require('./routes/attachment.js'));
app.use('/hades', require('./routes/hades.js'));


app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/static/index.html`);
});


app.listen(process.env.PORT, () => {
  console.log(`Server Started on PORT:${process.env.PORT}`);
});
