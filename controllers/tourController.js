const APIFeatures = require('./../utils/apiFeatures');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('./../middleware/asyncHandler');
// const express = require('express');
const Tour = require('./../models/tourModel');
// const fs = require('fs');

exports.topTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};
exports.popularTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

/**
 * @param {*} TOURS RESOURCE
 */
// desc      Get all tours
// @router  GET /api/v1/tour
// @access  Public
exports.getAllTours = asyncHandler(async (req, res, next) => {
  // EXCUTE THE QUERY
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagenate();
  const tours = await features.query;
  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours }
  });
});
// desc      Get Single tours
// @router  GET /api/v1/tours/:id
// @access  Public
exports.getTour = asyncHandler(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id); //Same as const tour = await Tour.findOne({ _id: req.params.id });
  if (!tour) {
    return next(new ErrorResponse(`No Tour found with that ID`, 404));
  }
  res.status(200).json({
    success: true,
    data: tour
  });
});

// desc      Create a tour
// @router  POST /api/v1/tours
// @access  Private
exports.createTour = asyncHandler(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      newTour
    }
  });
});
// desc      Update Tour
// @router  PATCH /api/v1/tours/:id
// @access  Private
exports.updateTour = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  });
  if (!tour) {
    return next(new ErrorResponse(`No Tour found with that ID`, 404));
  }
  res.status(200).json({
    status: 'success',
    data: { tour }
  });
});
// desc      Delete Tour
// @router  DELETE /api/v1/tours/:id
// @access  Private
exports.deleteTour = asyncHandler(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new ErrorResponse(`No Tour found with that ID`, 404));
  }
  res.status(204).json({
    status: 'success',
    data: null
  });
});
// desc      Tour Statistics
// @router  GET /api/v1/tours/tour-stats
// @access  Private
exports.getTourStats = asyncHandler(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        // _id: '$difficulty', // groups restuts based on this
        _id: { $toUpper: '$difficulty' }, // groups restuts based on this
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 } // 1 ascending
    }
    // {
    //   $match: { _id: { $ne: 'EASY' } }
    // }
  ]);

  res.status(200).json({
    status: 'success',
    data: { stats }
  });
});
// desc      Monthly Plan
// @router  GET /api/v1/tours/monthly-plan/2021
// @access  Public
exports.getMonthlyPlan = asyncHandler(async (req, res, next) => {
  const year = req.params.year * 1; //2021

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { numTourStarts: -1 }
    }
    // {
    //   $limit: 6
    // }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      plan
    }
  });
});
