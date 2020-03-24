const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

//Routes to Authenticate user
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgot_password', authController.forgotPassword);
router.patch('/reset_password/:token', authController.resetPassword);
router.patch(
  '/password_update',
  authController.protect,
  authController.updatePassword
);
router.get(
  '/me',
  authController.protect,
  userController.getMe,
  userController.getUser
);
router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

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
