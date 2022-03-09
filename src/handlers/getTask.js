import AWS from 'aws-sdk';

import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const headers = {
  "Content-Type": "application/json",
};

const dynamodb = new AWS.DynamoDB.DocumentClient();

const retrieveTask = async(id) => {
  try {
    const result = await dynamodb.get({
      TableName: process.env.TASKS_TABLE_NAME,
      Key: { id }
     }).promise();
    return result.Item;
   } catch (error) {
     console.error(error);
     throw new createError.InternalServerError(error);
   }
};

const GetTask = async (event) => {
  const { id } = event.pathParameters;
 let task = await retrieveTask(id);

  if(!task) {
    throw new createError.NotFound(`Task with id "${id}" not found`);
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(task),
  };
};

export const handler = commonMiddleware(GetTask);
