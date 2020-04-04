const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const cors = require('cors');
const cookieParser = require('cookie-parser');
// const colors = require('colors');
const ErrorResponse = require('./utils/ErrorResponse');
const errorHandler = require('./middleware/error');

//Routes
const viewRouter = require('./routes/viewRoutes');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
// const globalError = require('./controllers/errorController');

// const express = require('express');
const app = express();

app.set('view engine', 'pug'); //setting Pug as a template engine
app.set('views', path.join(__dirname, 'views')); // views directory

// app.use(cookieParser());
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
// app.options('*', cors());

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
    limit: '1000kb'
  })
);
app.use(express.urlencoded({ extended: true, limit: '1000kb' }));
app.use(cookieParser());

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

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// 2) ROUTES  MOUNTING

//    --> Back-End Routes
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// app.use(globalError);
app.use(errorHandler);

// app.use(errorHandler);
app.all('*', (req, res, next) => {
  next(
    new ErrorResponse(
      `Can't find ${req.originalUrl} on this awesome server`,
      404
    )
  );
});

module.exports = app;
