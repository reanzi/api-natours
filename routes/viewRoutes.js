const express = require('express');
const viewController = require('./../controllers/viewController');

const router = express.Router();

//    --> Front-End Routes

router.get('/', viewController.getOverview);

router.get('/tour/:slug', viewController.getTour);

module.exports = router;
