const APIFeatures = require('./../utils/apiFeatures');
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
// @router  GET /api/v1/tours
// @access  Public
exports.getAllTours = async (req, res) => {
  try {
    // EXCUTE THE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagenate();
    const tours = await features.query;

    // const query =  Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours }
    });
  } catch (e) {
    res.status(404).json({
      status: 'fail',
      data: `No Data found`
    });
  }
};
// desc      Get Single tours
// @router  GET /api/v1/tours/:id
// @access  Public
exports.getTour = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const tour = await Tour.findById(id); //Same as const tour = await Tour.findOne({ _id: req.params.id });
    res.status(200).json({
      status: 'success',
      data: { tour }
    });
  } catch (e) {
    res.status(404).json({
      status: 'fail',
      data: `No resources found with ID: ${id}`
    });
  }
};
// desc      Create a tour
// @router  POST /api/v1/tours
// @access  Private
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        newTour
      }
    });
  } catch (e) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!'
    });
  }
};
// desc      Update Tour
// @router  PATCH /api/v1/tours/:id
// @access  Private
exports.updateTour = async (req, res) => {
  const { id } = req.params;
  try {
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: 'success',
      data: { tour }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      data: 'Somethng went wrong!, try again'
    });
  }
};
// desc      Delete Tour
// @router  DELETE /api/v1/tours/:id
// @access  Private
exports.deleteTour = async (req, res) => {
  console.log(req.requestTime);
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(204).json({
      status: 'fail',
      data: { error }
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(204).json({
      status: 'fail',
      data: { error }
    });
  }
};
