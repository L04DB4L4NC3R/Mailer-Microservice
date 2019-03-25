const router = require("express").Router();
var csvjson = require('csvjson');
var { sendMail } = require('../mailer')


router.post('/', function (req, res) {
    var { csv, subject, template } = req.body
    if (!csv || !template) res.status(400).json({ success: false, msg: 'Incomplete request' });
    
    csv = Buffer.from(req.body.csv, 'base64').toString()
    json = csvjson.toObject(csv);
    json.forEach(data => {
        mail=template.replace('${name}',data.name).replace('${email}',data.email)
        sendMail([data.email], subject, true, mail).then(() => {
            return res.json({ success: true });
        }).catch((err) => {
            console.log(err)
            return res.status(400).json({ success: false });
        })
    });
})



module.exports = router