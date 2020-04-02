const express = require('express');
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');
// const authFrontController = require('./../controllers/authFrontController');

const router = express.Router();

router.use(authController.isLoggedIn);

//    --> Front-End Routes

router.get('/', viewController.getOverview);

router.get('/tour/:slug', viewController.getTour);
router.get('/login', viewController.getLoginForm);
router.get('/signup', viewController.getSignupForm);

module.exports = router;
