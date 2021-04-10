const DynamoDB = require("aws-sdk/clients/dynamodb");
const ulid = require("ulid");

const DocumentClient = new DynamoDB.DocumentClient();

const { REMINDERS_TABLE } = process.env;

module.exports.handler = async (event) => {
  const { title, remindAt } = event.arguments.reminder;
  const { username } = event.identity;
  const id = ulid.ulid();
  const timestamp = new Date().toJSON();

  const newReminder = {
    id,
    title,
    userId: username,
    remindAt,
    createdAt: timestamp,
  };

  await DocumentClient.put({
    TableName: REMINDERS_TABLE,
    Item: newReminder,
  }).promise();

  return newReminder;
};
