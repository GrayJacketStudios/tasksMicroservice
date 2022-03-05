'use strict';

const headers = {
  "Content-Type": "application/json",
};

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

const createTask = async (event) => {
  const {title, description, dueDate, priority, status, userId} = JSON.parse(event.body);

  if(!checkBody(event)) {
    return notFullParameters();
  }

  const task = {
    title,
    description,
    dueDate,
    priority,
    status,
    userId,
    createdAt: new Date().toISOString()
  };

  return {
    statusCode: 201,
    headers,
    body: JSON.stringify(task),
  };
};

module.exports.handler = createTask;
