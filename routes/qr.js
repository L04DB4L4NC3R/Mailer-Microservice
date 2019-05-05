const router = require("express").Router();
var QRCode = require('qrcode')
var fs = require('fs');
var csvjson = require('csvjson');
var { sendMail } = require('../mailer')

router.post('/', async function (req, res) {
    var { emails, csv, subject, html, txt, event, part } = req.body
    if (!(emails || csv || (event && part))) res.status(400).json({ success: false, msg: 'Incomplete request' });
    if (emails) {
        json = []
        emails.forEach(e => json.push({ email: e }))
    }
    else if (csv) {
        csv = Buffer.from(csv, 'base64').toString()
        json = csvjson.toObject(csv);
    }
    else {
        try {
            json = await require('../hades').getPart(event, part)
        }
        catch (e) { return res.status(400).json({ success: false, msg: e }); }
    }

    console.log(json)
    json.forEach(data => {
        QRCode.toDataURL(data.email, {
            version: 2, color: {
                dark: '#fff',
                light: '#000'
            }
        }, function (err, url) {
            sendMail([data.email], subject, html, html, txt, [{ href: url }]).then(() => {
                return res.json({ success: true });
            }).catch((err) => {
                console.log('got error')
                console.log(err)
                return res.status(400).json({ success: false });
            })
        })
    });
})



module.exports = router