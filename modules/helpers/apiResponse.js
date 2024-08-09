
const onSuccess = (res, message, statusCode, status, data) => {
    let respData = {
      message,
      statusCode,
      status,
      data,
    };
    res.status(200).send(respData);
  };

const onPostSuccess = (res, message, statusCode, status, data) => {
  let respData = {
    message,
    statusCode,
    status,
    data,
  };
  res.status(200).send(respData);
};
  
  const onError = (res, message, statusCode, status, data) => {
  
    let respData = {
      message,
      statusCode,
      status,
      data,
    };
    res.status(statusCode || 500).send(respData);
  };
  
  module.exports = { onSuccess, onPostSuccess, onError };
  