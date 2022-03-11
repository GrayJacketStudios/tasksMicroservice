import AWS from 'aws-sdk';

import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const headers = {
  "Content-Type": "application/json",
};

const dynamodb = new AWS.DynamoDB.DocumentClient();

const updateItem = async(item) => {
  try {
    const result = await dynamodb.update({
      TableName: process.env.TASKS_TABLE_NAME,
      Key: { id: item.id }
     }).promise();
    return result.Item;
   } catch (error) {
     console.error(error);
     throw new createError.InternalServerError(error);
   }
};

const UpdateTask = async (event) => {
  const item = event.body;
 let task = await updateItem(item);

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(task),
  };
};

export const handler = commonMiddleware(UpdateTask);
