import AWS from 'aws-sdk';
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import createError from 'http-errors';

const headers = {
  "Content-Type": "application/json",
};

const dynamodb = new AWS.DynamoDB();

const retrieveTasksByUser = async(userId) => {
  const params = {
    TableName : process.env.TASKS_TABLE_NAME,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
        ":userId": {
          N: userId
        }
    }
  };

  try {
    const result = await dynamodb.query(params).promise();
    return result.Items.map(item => {
      return AWS.DynamoDB.Converter.unmarshall(item);
    });
   } catch (error) {
     console.error(error);
     throw new createError.InternalServerError(error);
   }
};

const getTaskByUser = async (event) => {
  const { UserId } = event.pathParameters;
 let tasks = await retrieveTasksByUser(UserId);

  if(tasks.length === 0) {
    throw new createError.NotFound(`Task with UserId "${UserId}" not found`);
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(tasks),
  };
};

export const handler = middy(getTaskByUser)
  .use(httpJsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());
