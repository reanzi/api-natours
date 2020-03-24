// const APIFeatures = require('./../utils/apiFeatures');
// const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('./../middleware/asyncHandler');
const factory = require('./handlerFactory');
// const express = require('express');
const Tour = require('./../models/tourModel');
// const fs = require('fs');

/**
 * @param {*} TOURS RESOURCE
 */
// desc      Get all tours
// @router  GET /api/v1/tour
// @access  Public
exports.getAllTours = factory.getAll(Tour);

// desc      Get Single tours
// @router  GET /api/v1/tours/:id
// @access  Public
const options = [
  { path: 'reviews' },
  { path: 'guides', select: '-__v -passwordResetRequested' }
];
exports.getTour = factory.getOne(Tour, options);
exports.createTour = factory.createOne(Tour);

// desc      Update Tour
// @router  PATCH /api/v1/tours/:id
// @access  Private
exports.updateTour = factory.updateOne(Tour);

// desc      Delete Tour
// @router  DELETE /api/v1/tours/:id
// @access  Private
exports.deleteTour = factory.deleteOne(Tour);

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
