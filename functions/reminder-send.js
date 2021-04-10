const AWS = require("aws-sdk");

const cloudwatchevents = new AWS.CloudWatchEvents();

module.exports.handler = async (event) => {
  console.log("Send reminder event: ", JSON.stringify(event));

  const ruleName = event.rule.name;
  const { targetId } = event.data;

  await cloudwatchevents
    .removeTargets({
      Rule: ruleName,
      Ids: [targetId],
    })
    .promise();

  await cloudwatchevents
    .deleteRule({
      Name: ruleName,
    })
    .promise();
};
