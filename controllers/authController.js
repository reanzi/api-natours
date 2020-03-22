const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const asyncHandler = require('./../middleware/asyncHandler');
const ErrorResponse = require('./../utils/ErrorResponse');
const sendEmail = require('./../utils/mailer');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;
  user.passwordResetRequested = undefined;
  user.active = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};
exports.signup = asyncHandler(async (req, res, next) => {
  const newUser = await User.create(req.body);
  createSendToken(newUser, 201, res);
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
  if (await user.resetRequested())
    return next(
      new ErrorResponse(
        'You have requested a new password, instruction has been sent to your email. Please check your inbox',
        400
      )
    );
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new ErrorResponse('Incorect email or password', 401));
  }
  // .3) if everything is ok, send token to client
  createSendToken(user, 200, res);
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

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ErrorResponse('There is no user with that email address', 404)
    );
  }
  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  // console.log(resetToken);
  await user.save({ validateBeforeSave: false });

  // 3) Send reset token to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/reset_password/${resetToken}`;

  const message = `Forgot Password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nif you didn't forget your password, please ignore this email!`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min!)',
      message
    });
    res.status(200).json({
      status: 'success',
      message: 'Password reset Token sent to your email! Check your inbox '
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });
    // console.log(error);
    next(
      new ErrorResponse(
        'There was an error sending the email. Try again later',
        500
      )
    );
  }
});
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on the token => encrypt hte token then compare with stored
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() } // check if token is still valid
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new ErrorResponse('Token is Invalid or Expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetRequested = false;
  await user.save();

  // 3) Update changePasswordAt property for the user
  user.passwordChangedAt = Date.now();
  // 4) Login the user, send the JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = asyncHandler(async (req, res, next) => {
  // 1) Get the user from the collection
  const user = await User.findById(req.user.id).select('+password'); // User.findByIdAndUpdate will NOT work as intended

  // 2) Check if POSTED password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new ErrorResponse('Your current Password is wrong!', 401));
  }
  // 3) if Correct, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // 4) Login the user, send JWT
  createSendToken(user, 201, res);
});
