const express = require('express');
const morgan = require('morgan');
// const colors = require('colors');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const ErrorResponse = require('./utils/ErrorResponse');
const errorHandler = require('./middleware/error');
// const globalError = require('./controllers/errorController');

// const express = require('express');
const app = express();

// console.log('app runnign'.red);
//.1) MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// 2) ROUTES   mounting the router
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

// app.use(errorHandler);
app.all('*', (req, res, next) => {
  next(
    new ErrorResponse(
      `Can't find ${req.originalUrl} on this awesome server`,
      404
    )
  );
});

// app.use(globalError);
app.use(errorHandler);

// app.use(globalErrorController);
// app.use(errorHandler);
// app.all('*', (req, res, next) => {
//   next(new ErrorResponse(`Can't find ${req.originalUrl} on this server`, 404));
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'error';
//   res.status(req.statusCode).json({
//     status: err.status,
//     message: err.message
//   });
// });

module.exports = app;
