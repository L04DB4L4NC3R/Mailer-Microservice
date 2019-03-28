const router = require("express").Router();
var csvjson = require('csvjson');
var { sendMail } = require('../mailer')


router.post('/', async function (req, res) {
    var { csv, subject, html, txt, attach, event, part } = req.body
    if (!(csv || (event && part)) || !(html || txt)) res.status(400).json({ success: false, msg: 'Incomplete request' });

    if (csv) {
        csv = Buffer.from(csv, 'base64').toString()
        json = csvjson.toObject(csv);
    }
    else {
        try {
            json = await require('../hades').getPart(event, part)
        }
        catch (e) { return res.status(400).json({ success: false, msg: e }); }
    }

    mail = json.map(row => row.email)
    sendMail(mail, subject, Boolean(html), html, txt, attach).then(() => {
        return res.json({ success: true });
    }).catch((err) => {
        console.log(err)
        return res.status(400).json({ success: false });
    })
})



module.exports = router