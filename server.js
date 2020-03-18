const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! Shouting down the Server...');
  console.log(err);
  process.exit(1); // 1 mean uncaught exception, 0 success
});

// Load env variables
dotenv.config({ path: `./config/config.env` }); // should be access first before everything
const app = require('./app');

// const cloudDb = process.env.MONGO_URL.replace('<PASSWORD>', process.env.DB_PWD);
const localDb = process.env.MONGO_LOCAL;

/**
 * @Connection to the database
 */
mongoose
  .connect(localDb, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('DB connection successfull!');
  });

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! Shouting down the Server...');
  server.close(() => {
    process.exit(1); // 1 mean uncaught exception, 0 success
  });
});
