// const express = require('express');

const fs = require('fs');
const User = require('./../models/userModel');
const asyncHandler = require('./../middleware/asyncHandler');
const ErrorResponse = require('./../utils/ErrorResponse');

// const users = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
// );

/**
 *
 * @param {*} USERS RESOURCE
 *
 */
/**
 * @desc  Get all users
 * @router  GET /api/v1/users
 * @access  Public
 */
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().select('-passwordResetRequested');
  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users }
  });
});
// desc      Get Single users
// @router  GET /api/v1/users/:id
// @access  Public
exports.getUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findOne({ id });
  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'No such user in db'
    });
  }
  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

/**  @desc   Get current logged in User
 *  @route  POST /api/v1/auth/me
 *  @access private
 */
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(
      new ErrorResponse('Your session is expired,Please Login again', 401)
    );
  }
  user.passwordResetRequested = undefined;
  res.status(200).json({
    success: true,
    data: user
  });
  // next();
});
// desc      Create a user
// @router  POST /api/v1/users
// @access  Private
exports.createUser = (req, res) => {
  const newUser = 'JD';

  res.status(201).json({
    status: 'success',
    data: {
      newUser
    }
  });
};
// desc      Update User, by admins
// @router  PATCH /api/v1/users/:id
// @access  Private
exports.updateUser = (req, res) => {
  const user = '';
  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'No such user'
    });
  }
  res.status(200).json({
    status: 'success',
    data: { user: '<Updated User>' }
  });
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
// desc      Current user to update user releted stuff
// @router  PATCH /api/v1/users/updateMe
// @access  Private
exports.updateMe = asyncHandler(async (req, res, next) => {
  // 1) Create error if user POTs password data

  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new ErrorResponse(
        'This is not for password updated. Please use /password_update'
      ),
      400
    );
  }
  // Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 2) Update user doccument
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});
// desc      Deactivate User Account by User
// @router  DELETE /api/v1/users/deleteMe
// @access  Private
exports.deleteMe = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});
// desc      Delete User
// @router  DELETE /api/v1/users/:id
// @access  Private
exports.deleteUser = (req, res) => {
  console.log(req.requestTime);
  const user = users.find(el => el._id === req.params.id);
  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'No such user'
    });
  }
  res.status(204).json({
    status: 'success',
    data: null
  });
};
