const ErrorResponse = require('../utils/ErrorResponse');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new ErrorResponse(message, 400);
};

const handleDuplicateErrorDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  // console.log(value);
  const message = `Duplicate field value : ${value}  XX please use another value.`;
  return new ErrorResponse(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new ErrorResponse(message, 400);
};
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};
const handleJWTError = () =>
  new ErrorResponse('Invalid Token, Please login again', 401);
const handleJWTExpiredError = () =>
  new ErrorResponse('Token expired, Please login again', 401);
const sendErrorProd = (err, res) => {
  // Operational, trusted error: Send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
    // Programming or other unknown error: don't leak error details to client
  } else {
    // 1) log error to the console
    console.error('ERROR: ', err);
    // 2) Sent generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }
};

const errorHandler = (err, req, res, next) => {
  // console.log('Errorr is:', err);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    //mongoose bad ObjectId
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateErrorDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
  // console.log(err);
};
module.exports = errorHandler;
