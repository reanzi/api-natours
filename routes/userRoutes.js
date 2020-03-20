const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

//Routes to Authenticate user
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgot_password', authController.forgotPassword);
router.post('/reset_password', authController.resetPassword);

// Routes to work with the users already in the system
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
