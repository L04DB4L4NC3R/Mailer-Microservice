define({ "api": [
  {
    "type": "post",
    "url": "/sendMail",
    "title": "",
    "version": "0.1.0",
    "name": "SendMail",
    "group": "Admin",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "eventName",
            "description": "<p>Name of the event</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mailSubject",
            "description": "<p>Subject of the mail to be sent</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mailBody",
            "description": "<p>Body of the mail to be sent</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"absent\"",
              "\"present\"",
              "\"both\""
            ],
            "optional": false,
            "field": "sendTo",
            "description": "<p>Target audience</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"male\"",
              "\"female\"",
              "\"both\""
            ],
            "optional": false,
            "field": "gender",
            "description": "<p>Target audience gender</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "isMarkdown",
            "description": "<p>Whether the mail body is formatted with markdown</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "day",
            "description": "<p>The event day</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>Response status</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "err",
            "description": "<p>Errors, if any</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"status\": \"success\",\n    \"err\": null\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ValidationFailed",
            "description": "<p>The request body validation check failed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ParticipantsEmpty",
            "description": "<p>The participants list is empty</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Validation-Error-Response:",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n    \"err\": [\n        {\n            \"msg\": \"Invalid value\",\n            \"param\": \"mailSubject\",\n            \"location\": \"body\"\n        },\n        {\n            \"msg\": \"Invalid value\",\n            \"param\": \"mailBody\",\n            \"location\": \"body\"\n        }\n    ]\n}",
          "type": "json"
        },
        {
          "title": "Participants-Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n    \"status\": \"EmptyParticipants\",\n    \"err\": \"Participant list is empty\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/index.js",
    "groupTitle": "Admin"
  }
] });
