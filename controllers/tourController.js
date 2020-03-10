/* eslint-disable node/no-unsupported-features/es-syntax */
// const express = require('express');
const Tour = require('./../models/tourModel');
// const fs = require('fs');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );
// const router = express.Router();

// Middleware to check id
// exports.checkId = (req, res, next, val) => {
//   console.log(`Tour id is: ${val}`);
//   // if (val > tours.length) {
//   //   return res.status(404).json({
//   //     status: 'fail',
//   //     message: 'No Resources found'
//   //   });
//   // }
//   next();
// };

// // Middleware to check body content
// exports.checkBody = (req, res, next) => {
//   // console.log(req.body);
//   const { name, regPrice } = req.body;
//   if (name || regPrice !== '') {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Please fill all required fields marked *'
//     });
//   }
//   next();
// };

/**
 *
 * @param {*} TOURS RESOURCE
 *
 */
// desc      Get all tours
// @router  GET /api/v1/tours
// @access  Public
exports.getAllTours = async (req, res) => {
  try {
    //BUILD THE QUERY
    // 1A:) Filtering
    const queryObj = { ...req.query }; // destructuring all parameters form req.query int queryObj
    const excluddFields = ['page', 'sort', 'limit', 'fields'];
    excluddFields.forEach(el => delete queryObj[el]);

    // 1B:) Advance Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    // console.log(JSON.parse(queryStr));

    let query = Tour.find(JSON.parse(queryStr));
    // 2:) SORTING
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // 3:) FIELD LIMITING
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v'); // exlude __v
    }

    // 4:) PAGINATIONS and RESULT SET
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 2;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page Does not Exist');
    }

    // EXCUTE THE QUERY
    const tours = await query;

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
