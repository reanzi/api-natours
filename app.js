const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// const express = require('express');
const app = express();

//.1) MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('hello from middleware');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2) ROUTES   mounting the router
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

module.exports = app;