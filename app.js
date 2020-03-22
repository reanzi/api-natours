const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
// const colors = require('colors');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const ErrorResponse = require('./utils/ErrorResponse');
const errorHandler = require('./middleware/error');
// const globalError = require('./controllers/errorController');

// const express = require('express');
const app = express();

// Set Security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit request from sama IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(
  express.json({
    limit: '10kb'
  })
);

// Data sanitization against  NoSQL Injection
app.use(mongoSanitize());

// Data sanitization against  XSS
app.use(xss());
// Prevent  against  Http Parameter Pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'difficulty',
      'price'
    ]
  })
);
// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
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

module.exports = app;
