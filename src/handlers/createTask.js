import {v4 as uuid} from 'uuid';
import AWS from 'aws-sdk';

const headers = {
  "Content-Type": "application/json",
};

const dynamodb = new AWS.DynamoDB.DocumentClient();

const checkBody = (event) => {
  if (!event.body) {
    return false;
  }
  const {title, userId} = JSON.parse(event.body);
  if(!title || !userId) {
    return false;
  }
  return true;
};

const notFullParameters = () => {
  return {
    statusCode: 400,
    headers,
    body: JSON.stringify({
      message: 'Please provide title and userId'
    })
  };
};

const CreateTask = async (event) => {
  const {title, description, dueDate, priority, status, userId} = JSON.parse(event.body);

  if(!checkBody(event)) {
    return notFullParameters();
  }

  const task = {
    id: uuid(),
    title,
    description,
    dueDate,
    priority,
    status,
    userId,
    createdAt: new Date().toISOString()
  };

  await dynamodb.put({
    TableName: process.env.TASKS_TABLE_NAME,
    Item: task,
  }).promise();

  return {
    statusCode: 201,
    headers,
    body: JSON.stringify(task),
  };
};

export const handler = CreateTask;
