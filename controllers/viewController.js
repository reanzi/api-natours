const Tour = require('./../models/tourModel');
const asyncHandler = require('./../middleware/asyncHandler');
const ErrorResponse = require('./../utils/ErrorResponse');
const User = require('./../models/userModel');

exports.getOverview = asyncHandler(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();

  // 2) Build template

  // 3) Render template using tour data from step 1
  res.status(200).render('overview', {
    tours
  });
});

exports.getTour = asyncHandler(async (req, res, next) => {
  // 1) Get the data for the requested review
  const tour = await await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if (!tour) {
    return next(new ErrorResponse('There is no tour wiht that name', 404));
  }
  //   console.log(tour);
  // 2) Build the template

  // 3) Render template using the data from the step 1
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};
exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Create your account'
  });
};
exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'User Account Page'
  });
};

exports.updateUserData = asyncHandler(async (req, res) => {
  // console.log('UPDATING', req.body);
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );
  res.status(200).render('account', {
    title: 'Your Account Page',
    user: updatedUser //passing new user
  });
});
