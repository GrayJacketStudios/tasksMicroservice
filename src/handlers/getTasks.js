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

const retrieveTasks = async() => {
  try {
    const result = await dynamodb.scan({ TableName: process.env.TASKS_TABLE_NAME }).promise();
    return result.Items;
   } catch (error) {
     console.error(error);
     throw new createError.InternalServerError(error);
   }
};

const GetTasks = async () => {
 let tasks = await retrieveTasks();

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(tasks),
  };
};

export const handler = middy(GetTasks)
  .use(httpJsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());
