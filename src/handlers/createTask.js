'use strict';

const createTask = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        context,
        input: event,
      },
      null,
      2
    ),
  };
};

module.exports.handler = createTask;
