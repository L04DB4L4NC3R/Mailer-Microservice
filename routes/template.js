const router = require("express").Router();
var csvjson = require('csvjson');
var { sendMail } = require('../mailer')


router.post('/', async function (req, res) {
    var { csv, subject, template, event, part } = req.body
    if (!(csv || (event && part)) || !template) res.status(400).json({ success: false, msg: 'Incomplete request' });

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