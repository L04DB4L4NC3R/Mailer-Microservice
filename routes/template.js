const router = require("express").Router();
let csvjson = require('csvjson');
let { sendMail } = require('../mailer')


router.post('/', async (req, res) => {
    let { emails, csv, subject, template, event, part } = req.body
    if (!(emails || csv || (event && part)) || !template) res.status(400).json({ success: false, msg: 'Incomplete request' });
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
        mail = template.replace('${name}', data.name).replace('${email}', data.email)
        sendMail([data.email], subject, true, mail).then(() => {
            return res.json({ success: true });
        }).catch((err) => {
            console.log(err)
            return res.status(400).json({ success: false });
        })
    });
})



module.exports = router
