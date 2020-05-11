const functions = require("firebase-functions");
var moment = require("moment-timezone");

const fetch = require("node-fetch");
const Bluebird = require("bluebird");
fetch.Promise = Bluebird;

const webhook = functions.config().slack.webhook;
let baseUrl = functions.config().global.base_url;

const newEventNotification = async (eventDetails) => {
  console.log(eventDetails);
  const message = {
    username: "Error notifier",
    text: ":rocket: A new event has been created!",
    icon_emoji: ":rocket:",
    attachments: [
      {
        color: "#5cdb94",
        fields: [
          {
            title: "Title",
            value: eventDetails.title,
            short: true
          },
          {
            title: "When",
            value: moment(eventDetails.eventBeginDate.toDate())
              .tz("Europe/Zurich")
              .format("dddd, DD MMMM YYYY    HH:mm z"),
            short: true
          }
        ],
        actions: [
          {
            type: "button",
            text: "View Event",
            url: baseUrl + "/v/" + eventDetails.originalSessionId
          }
        ]
      }
    ]
  };

  await fetch(webhook, {
    method: "post",
    body: JSON.stringify(message),
    headers: { "Content-Type": "application/json" }
  });
};

module.exports = {
  newEventNotification
};
