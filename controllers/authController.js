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
