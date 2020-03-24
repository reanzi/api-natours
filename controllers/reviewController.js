// const APIFeatures = require('./../utils/apiFeatures');
// const ErrorResponse = require('../utils/ErrorResponse');
// const asyncHandler = require('./../middleware/asyncHandler');
const Review = require('./../models/reviewModel');
const factory = require('./handlerFactory');

// middleware to run before creating a new reviewp
exports.setTourUserIds = (req, res, next) => {
  // Allow Nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.author) req.body.author = req.user.id;

  next();
};
// desc      Fetch all review
// @router  POST /api/v1/tours/:id/reviews
// @access  Public
exports.getAllReviews = factory.getAll(Review);

// desc      Fetch single review
// @router  POST /api/v1/tours/:id/reviews/:id
// @access  Public
exports.getReview = factory.getOne(Review);

// desc      Create a review
// @router  POST /api/v1/tours/:id/reviews
// @access  Private
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
