const express = require('express');
const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);
const router = express.Router();

// Middleware to check id
exports.checkId = (req, res, next, val) => {
  console.log(`Tour id is: ${val}`);
  if (val > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'No Resources found'
    });
  }
  next();
};

// Middleware to check body content
exports.checkBody = (req, res, next) => {
  // console.log(req.body);
  let { name, regPrice } = req.body;
  if (name || regPrice !== '') {
    return res.status(400).json({
      status: 'fail',
      message: 'Please fill all required fields marked *'
    });
  }
  next();
};

/**
 *
 * @param {*} TOURS RESOURCE
 *
 */
// desc      Get all tours
// @router  GET /api/v1/tours
// @access  Public
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours }
  });
};
// desc      Get Single tours
// @router  GET /api/v1/tours/:id
// @access  Public
exports.getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id);
  res.status(200).json({
    status: 'success',
    data: { tour }
  });
};
// desc      Create a tour
// @router  POST /api/v1/tours
// @access  Private
exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      res.status(201).json({
        status: 'success',
        data: {
          newTour
        }
      });
    }
  );
};
// desc      Update Tour
// @router  PATCH /api/v1/tours/:id
// @access  Private
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: { tour: '<Updated Tour>' }
  });
};
// desc      Delete Tour
// @router  DELETE /api/v1/tours/:id
// @access  Private
exports.deleteTour = (req, res) => {
  console.log(req.requestTime);
  res.status(204).json({
    status: 'success',
    data: null
  });
};
