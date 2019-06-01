const router = require("express").Router();
let csvjson = require('csvjson');
let { sendMail } = require('../mailer')


router.post('/', async (req, res) => {
    let { emails, csv, subject, html, txt, attach, event, part } = req.body
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
    mail = json.map(row => row.email)
    sendMail(mail, subject, Boolean(html), html, txt, attach).then(() => {
        return res.json({ success: true });
    }).catch((err) => {
        console.log(err)
        return res.status(400).json({ success: false });
    })
})



module.exports = router
