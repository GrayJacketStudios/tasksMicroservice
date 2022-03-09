import AWS from 'aws-sdk';

import commonMiddleware from '../lib/commonMiddleware';
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

export const handler = commonMiddleware(GetTasks);
