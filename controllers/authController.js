const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const asyncHandler = require('./../middleware/asyncHandler');
const ErrorResponse = require('./../utils/ErrorResponse');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};
exports.signup = asyncHandler(async (req, res, next) => {
  const newUser = await User.create(req.body);
  //Login User
  // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_EXPIRES_IN
  // });
  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token,
    data: { user: newUser }
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // .1) check if email & password do exist
  if (!email || !password) {
    return next(new ErrorResponse('Please Provide email and Password!', 400));
  }
  // .2) Check if user exist & password is correct
  const user = await User.findOne({ email }).select('+password');
  // const correct = await user.correctPassword(password, user.password);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new ErrorResponse('Incorect email or password', 401));
  }
  // .3) if everything is ok, send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'succes',
    token
  });
});

exports.protect = asyncHandler(async (req, res, next) => {
  // 1.) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]; // Extract token
  }
  if (!token) {
    return next(new ErrorResponse('You are not logged in, please login)', 401));
  }
  // 2.) Verification of the token
  const payload = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3.) Check if user still exist
  const currentUser = await User.findById(payload.id);
  if (!currentUser) {
    return next(
      new ErrorResponse('The user belonging to this token does not exit.', 401)
    );
  }
  // 4.) Check if user changed password after the token was issued
  if (currentUser.changePasswordAfter(payload.iat)) {
    return next(
      new ErrorResponse('User recently changed password! Please login again.'),
      401
    );
  }
  // 5.) Grant Access and return the user Granted Access
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles ['admin', 'lead-guide']; eg role='user'
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse('Permission denied to this action', 403));
    }
    next();
  };
};
