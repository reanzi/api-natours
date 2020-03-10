const express = require('express');
const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  topTours,
  popularTours
} = require('../controllers/tourController');

const router = express.Router();

//Middleware runs only in tour routes
// router.param('id', checkId);
router.route('/top-5-cheap/').get(topTours, getAllTours);
router.route('/top-5-popular/').get(popularTours, getAllTours);

router
  .route('/')
  .get(getAllTours)
  .post(createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

module.exports = router;
