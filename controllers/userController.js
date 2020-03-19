// const express = require('express');

const fs = require('fs');
const User = require('./../models/userModel');
const asyncHandler = require('./../middleware/asyncHandler');

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
  const users = await User.find();
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
// desc      Create a user
// @router  POST /api/v1/users
// @access  Private
exports.createUser = (req, res) => {
  const newId = users[users.length - 1].id + 1;
  const newUser = Object.assign({ id: newId }, req.body);
  users.push(newUser);
  fs.writeFile(
    `${__dirname}/dev-data/data/users.json`,
    JSON.stringify(users),
    err => {
      res.status(201).json({
        status: 'success',
        data: {
          newUser
        }
      });
    }
  );
};
// desc      Update User
// @router  PATCH /api/v1/users/:id
// @access  Private
exports.updateUser = (req, res) => {
  const user = users.find(el => el._id === req.params.id);
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
