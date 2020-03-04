const express = require('express');
const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  checkId,
  checkBody
} = require('../controllers/tourController');

const router = express.Router();

//Middleware runs only in tour routes
router.param('id', checkId);

router
  .route('/')
  .get(getAllTours)
  .post(checkBody, createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

module.exports = router;
