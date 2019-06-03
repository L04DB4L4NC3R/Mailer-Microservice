const router = require('express').Router();
const { sendMail } = require('../mailer');

router.post('/', (req, res) => {
  const {
    event, part, subject, html,
  } = req.body;
  if (!event || !part) res.status(400).json({ success: false, msg: 'Incomplete request' });
  require('../hades').getPart(req.body.event, req.body.part)
    .then((emails) => {
      sendMail(emails, subject, true, html).then(() => res.json({ success: true, emails })).catch((err) => {
        console.log(err);
        return res.status(400).json({ success: false });
      });
    }).catch(e => res.status(400).json({ success: false, msg: e }));
});


module.exports = router;
