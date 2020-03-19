const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const asyncHandler = require('./../middleware/asyncHandler');

exports.signup = asyncHandler(async (req, res, next) => {
  const newUser = await User.create(req.body);
  //Login User
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
  res.status(201).json({
    status: 'success',
    token,
    data: { user: newUser }
  });
});
