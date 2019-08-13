const express = require('express');
const router = express.Router();
const {check, validationResult, param} = require('express-validator');
const showdown = require('showdown');
const converter = new showdown.Converter();
const mail = require('@sendgrid/mail');
const axios = require('axios');
const qr = require('qrcode');

const TEST_API_KEY = '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';

mail.setApiKey(TEST_API_KEY);

router.get('/', (req, res) => {
    res.status(200).send({
        status: 'Health check succeeded.'
    });
});

// router.post('/testHtml', (req, res) => {
//     console.log(req.body);
//     // res.status(200).send(req.body);
//     res.status(200).send(converter.makeHtml(req.body.markdown));
// });


/**
 * @api {post} /sendMail
 * @apiVersion 0.1.0
 * @apiName SendMail
 * @apiGroup Admin
 *
 * @apiParam {String} eventName Name of the event
 * @apiParam {String} mailSubject Subject of the mail to be sent
 * @apiParam {String} mailBody Body of the mail to be sent
 * @apiParam {String="absent", "present", "both"} sendTo Target audience
 * @apiParam {String="male", "female", "both"} gender Target audience gender
 * @apiParam {Boolean} isMarkdown Whether the mail body is formatted with markdown
 * @apiParam {Number} day The event day
 *
 * @apiSuccess {String} status Response status
 * @apiSuccess {Object} err Errors, if any
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "status": "success",
 *          "err": null
 *      }
 *
 * @apiError ValidationFailed The request body validation check failed
 * @apiErrorExample Validation-Error-Response:
 *      HTTP/1.1 422 Unprocessable Entity
 *      {
 *          "err": [
 *              {
 *                  "msg": "Invalid value",
 *                  "param": "mailSubject",
 *                  "location": "body"
 *              },
 *              {
 *                  "msg": "Invalid value",
 *                  "param": "mailBody",
 *                  "location": "body"
 *              }
 *          ]
 *      }
 *
 * @apiError ParticipantsEmpty The participants list is empty
 * @apiErrorExample Participants-Error-Response:
 *      HTTP/1.1 500 Internal Server Error
 *      {
 *          "status": "EmptyParticipants",
 *          "err": "Participant list is empty"
 *      }
 */
router.post('/sendEmails', [
    check('eventName').not().isEmpty(),
    check('mailSubject').not().isEmpty(),
    check('mailBody').not().isEmpty().trim().escape(),
    check('sendTo').not().isEmpty().isIn(['absent', 'present', 'both']),
    check('gender').not().isEmpty().isIn(['male', 'female', 'both']),
    check('isMarkdown').not().isEmpty().isBoolean(),
    check('day').not().isEmpty().isInt()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({
            status: "ValidationFailed",
            err: errors.array()
        });
    } else {
        const {eventName, mailSubject, mailBody, sendTo, gender, isMarkdown, day} = req.body;
        let response;
        switch (sendTo) {
            case 'absent':
                try {
                    response = await axios.post('http://139.59.9.221/api/v1/simple-projection/project-absent', {
                        event: eventName,
                        day: day,
                        query: {
                            key: 'gender',
                            value: gender === 'female' ? 'F' : 'M'
                        }
                    });
                } catch (e) {
                    console.log(e);
                }
                break;
            case 'present':
                try {
                    response = await axios.post('http://139.59.9.221/api/v1/simple-projection/project-absent', {
                        event: eventName,
                        day: day,
                        query: {
                            key: 'gender',
                            value: gender === 'female' ? 'F' : 'M'
                        }
                    });
                } catch (e) {
                    console.log(e);
                }
                break;
            case  'both':
                try {
                    response = await axios.post('http://139.59.9.221/api/v1/simple-projection/project-all', {
                        event: eventName,
                        query: {
                            key: 'gender',
                            value: gender === 'female' ? 'F' : 'M'
                        }
                    });
                } catch (e) {
                    console.log(e);
                }
                break;
        }

        if (typeof response === 'undefined' || response.rs.length === 0) {
            return res.status(500).send({
                status: 'EmptyParticipants',
                err: 'Participant list is empty'
            });
        } else {
            res.status(200).send({
                status: 'success',
                err: null,
                participants: response.rs.length
            });
        }

        let code;
        try {
            code = await qr.toDataURL(participant.email);
        } catch (e) {
            console.log(e);
        }


        for (const participant of response.rs) {
            const msg = {
                to: participant.email,
                from: 'test@example.com',
                subject: mailSubject,
                html: isMarkdown ? converter.makeHtml(mailBody) : mailBody,
                attachments: [
                    {
                        content: code.replace(/^data:image\/(png|jpg);base64,/, ""),
                        filename: 'qrcode.png',
                        type: 'image/png',
                        disposition: 'attachment',
                    }
                ]
            };
            try {
                await mail.send(msg);
            } catch (e) {
                console.log(e);
            }
        }
    }
});

router.post('/mailer/:customEmail', [
    check('mailSubject').not().isEmpty(),
    check('mailBody').not().isEmpty().trim().escape(),
    check('isMarkdown').not().isEmpty().isBoolean(),
    param('customEmail').not().isEmpty().isEmail()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({
            errors: errors.array()
        });
    } else {
        const {mailSubject, mailBody, isMarkdown,} = req.body;
        const {customEmail} = req.params;
        let code;
        try {
            code = await qr.toDataURL(customEmail);
        } catch (e) {
            console.log(e);
        }

        const msg = {
            to: customEmail,
            from: 'test@example.com',
            subject: mailSubject,
            html: isMarkdown ? converter.makeHtml(mailBody) : mailBody,
            attachments: [
                {
                    content: code.replace(/^data:image\/(png|jpg);base64,/, ""),
                    filename: 'qrcode.png',
                    type: 'image/png',
                    disposition: 'attachment',
                }
            ]
        };
        try {
            await mail.send(msg);
            return res.status(200).send({
                status: "success",
                err: null
            })
        } catch (e) {
            console.log(e);
            return res.status(500).send({
                status: "failure",
                err: e
            })
        }
    }
});


module.exports = router;