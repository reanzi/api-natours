const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('./../../models/tourModel');
const User = require('./../../models/userModel');
const Review = require('./../../models/reviewModel');

dotenv.config({ path: `../../config/config.env` }); // should be access first before everything

// const cloudDb = process.env.MONGO_URL.replace('<PASSWORD>', process.env.DB_PWD);
const localDb = process.env.MONGO_LOCAL;

/**
 * @Connection to the database
 */
// console.log(localDb);
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

/**
 * @READ JSON FILES
 */
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

// IMPORT DATA INTO DB
const importData = async () => {
  //   let i = 0;
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false }); //Disable validation
    await Review.create(reviews);
    console.log('Data Successfull Loaded!');
    // for (const tour of tours) {
    //   await Tour.create(tour);
    //   i++;
    //     showPercent(i);
    // }
  } catch (error) {
    console.log(error);
  }
  process.exit();
};
// DELETE DATA FORM DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data Successfull Deleted!');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
