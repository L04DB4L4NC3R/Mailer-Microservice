const router = require("express").Router();
var csvjson = require('csvjson');
var { sendMail } = require('../mailer')


router.post('/', function (req, res) {
    var { csv, subject, html, txt, attach } = req.body
    if (!csv || !(html || txt)) res.status(400).json({ success: false, msg: 'Incomplete request' });
    
    csv = Buffer.from(req.body.csv, 'base64').toString()
    json = csvjson.toObject(csv);
    mail = json.map(row => row.email)
    sendMail(mail, subject, Boolean(html), html, txt, attach).then(() => {
        return res.json({ success: true });
    }).catch((err) => {
        console.log(err)
        return res.status(400).json({ success: false });
    })
})



module.exports = router