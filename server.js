const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: `./config/config.env` }); // should be access first before everything

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
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
