// const APIFeatures = require('./../utils/apiFeatures');
// const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('./../middleware/asyncHandler');
const Review = require('./../models/reviewModel');

// desc      Fetch all review
// @router  POST /api/v1/tours/:id/reviews
// @access  Public
exports.getAllReviews = asyncHandler(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: { reviews }
  });
});

// desc      Create a review
// @router  POST /api/v1/tours/:id/reviews
// @access  Private
exports.createReview = asyncHandler(async (req, res, next) => {
  // Allow Nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.author) req.body.author = req.user.id;

  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      newReview
    }
  });
});
