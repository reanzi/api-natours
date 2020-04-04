// const APIFeatures = require('./../utils/apiFeatures');
const multer = require('multer');
const sharp = require('sharp');

const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('./../middleware/asyncHandler');
const factory = require('./handlerFactory');
// const express = require('express');
const Tour = require('./../models/tourModel');
// const fs = require('fs');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  // console.log(req.files);
  // console.log(file);
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(
      new ErrorResponse('Not an image! Please upload only images.', 400),
      false
    );
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 }
]);

exports.resizeTourImages = asyncHandler(async (req, res, next) => {
  // console.log(req.files);
  if (!req.files.imageCover || !req.files.images) return next();

  // 1.) Cover Image
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  // 1.) Images
  req.body.images = []; // Create the array to hold the images
  await Promise.all(
    // await all await in the enclosed async
    req.files.images.map(async (file, index) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${index + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);

      req.body.images.push(filename);
    })
  );

  console.log(req.body);
  next();
});
// upload.single('fieldName'); // uploading single image => req.file
// upload.array('arrayName', maxCount); // uploading multiple images into a single array => req.files
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
  { path: 'reviews' }
  // { path: 'guides', select: '-__v -passwordResetRequested' }
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

// '/tours-within/:distance/center/-6.4418128,38.8937168/unit/:unit'
exports.getToursWithin = asyncHandler(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  /**
   * radius should be in radians, hence we divide the distance by the radius of the earth
   */
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  if (!lat || !lng) {
    next(
      new ErrorResponse(
        'Please provide Latitude and Longitude in the format of lat,lng'
      ),
      400
    );
  }

  // console.log(distance, lat, lng, unit);
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours
    }
  });
});

exports.getDistances = asyncHandler(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
  if (!lat || !lng) {
    next(
      new ErrorResponse(
        'Please provide Latitude and Longitude in the format of lat,lng'
      ),
      400
    );
  }

  const distances = await Tour.aggregate([
    {
      $project: {
        distance: 1,
        name: 1
      }
    },
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances
    }
  });
});
