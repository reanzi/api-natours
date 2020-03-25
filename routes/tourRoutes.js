const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

// POST /tour/tourID/reviews
// GET /tour/tourID/reviews
// GET /tour/tourID/reviews/reviewID

// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );

router.use('/:tourId/reviews', reviewRouter); // Mounting a reviewRouter in the tourRouter
//Middleware runs only in tour routes
// router.param('id', checkId);
router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );
router
  .route('/top-5-cheap')
  .get(tourController.topTours, tourController.getAllTours);
router
  .route('/top-5-popular')
  .get(tourController.popularTours, tourController.getAllTours);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );

// Route to get tours within a certain distance
// /tours-within?distance=233&center=-40,35&unit=km   => using query string
// /tours-within/233/center/-6.4418128,38.8937168/unit/km  => cleaner way

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

// Calculate the distances from a point to all other tours
router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
