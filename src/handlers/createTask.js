import {v4 as uuid} from 'uuid';
import AWS from 'aws-sdk';

import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import createError from 'http-errors';

const headers = {
  "Content-Type": "application/json",
};

const dynamodb = new AWS.DynamoDB.DocumentClient();

const checkBody = (event) => {
  if (!event.body) {
    return false;
  }
  const {title, userId} = event.body;
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

const pushTask = async (task) => {
  try {
    await dynamodb.put({
      TableName: process.env.TASKS_TABLE_NAME,
      Item: task,
    }).promise();
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
};

const CreateTask = async (event) => {
  const {title, description, dueDate, priority, status, userId} = event.body;

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

  await pushTask(task);

  return {
    statusCode: 201,
    headers,
    body: JSON.stringify(task),
  };
};

export const handler = middy(CreateTask)
  .use(httpJsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());
