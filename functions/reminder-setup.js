const AWS = require("aws-sdk");
const ulid = require("ulid");

const cloudwatchevents = new AWS.CloudWatchEvents();

module.exports.handler = async (event) => {
  console.log("Setup reminder event: ", JSON.stringify(event));

  const ruleName = event.detail.title.replace(/\s+/g, "-").toLowerCase();
  const { userId } = event.detail;
  const targetId = ulid.ulid();
  const remindAt = new Date(Date.parse(event.detail.remindAt));

  await cloudwatchevents
    .putRule({
      Name: ruleName,
      Description: event.detail.title,
      ScheduleExpression: `cron(${remindAt.getUTCMinutes()} ${remindAt.getUTCHours()} ${remindAt.getUTCDate()} ${
        remindAt.getUTCMonth() + 1
      } ? ${remindAt.getUTCFullYear()})`,
    })
    .promise();

  await cloudwatchevents
    .putTargets({
      Rule: ruleName,
      Targets: [
        {
          Id: targetId,
          Arn: process.env.REMINDER_SEND_FUNCTION_ARN,
          Input: JSON.stringify({
            rule: { name: ruleName },
            data: { userId, targetId },
          }),
        },
      ],
    })
    .promise();
};
