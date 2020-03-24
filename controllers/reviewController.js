const APIFeatures = require('./../utils/apiFeatures');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('./../middleware/asyncHandler');
const Review = require('./../models/reviewModel');

// desc      Fetch all review
// @router  POST /api/v1/reviews
// @access  Public
exports.getAllReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find();

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: { reviews }
  });
});

// desc      Create a review
// @router  POST /api/v1/reviews
// @access  Private
exports.createReview = asyncHandler(async (req, res, next) => {
  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      newReview
    }
  });
});
