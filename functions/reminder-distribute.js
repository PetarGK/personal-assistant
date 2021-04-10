const EventBridge = require("aws-sdk/clients/eventbridge");

const eventBridge = new EventBridge();

module.exports.handler = async (event) => {
  await eventBridge
    .putEvents({
      Entries: event.Records.map((entry) => ({
        EventBusName: process.env.REMINDERS_EVENTBUS_NAME,
        Source: "reminder.created",
        DetailType: "title,remindAt,userId",
        Detail: JSON.stringify({
          title: entry.dynamodb.NewImage.title.S,
          remindAt: entry.dynamodb.NewImage.remindAt.S,
          userId: entry.dynamodb.NewImage.userId.S,
        }),
      })),
    })
    .promise();
};
