const multer = require('multer');
const sharp = require('sharp');
const User = require('./../models/userModel');
const asyncHandler = require('./../middleware/asyncHandler');
const ErrorResponse = require('./../utils/ErrorResponse');
const factory = require('./handlerFactory');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     // user-id-timeStample.fileExtension
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// });
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
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

exports.uploadUserPhoto = upload.single('photo');

// const users = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
// );

/**
 *
 * @param {*} USERS RESOURCE
 *
 */
/**
 * @desc  Get all users
 * @router  GET /api/v1/users
 * @access  Public
 */

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead'
  });
};
/**
 * @desc  Get all users
 * @router  GET /api/v1/users
 * @access  Public
 */
exports.getAllUsers = factory.getAll(User);
// asyncHandler(async (req, res, next) => {
//   const users = await User.find().select('-passwordResetRequested');
//   // SEND RESPONSE
//   res.status(200).json({
//     status: 'success',
//     results: users.length,
//     data: { users }
//   });
// });
// desc      Get Single users
// @router  GET /api/v1/users/:id
// @access  Public
exports.getUser = factory.getOne(User);

/**  @desc   Get current logged in User
 *  @route  POST /api/v1/auth/me
 *  @access private
 */
exports.getMe = asyncHandler(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});
// desc      Update User, by admins; Updating data not the password
// @router  PATCH /api/v1/users/:id
// @access  Private
exports.updateUser = factory.updateOne(User);

// desc      Deactivate User Account by User
// @router  DELETE /api/v1/users/deleteMe
// @access  Private
exports.deleteMe = factory.deactivateUser(User);

// desc      Delete User By admins User
// @router  DELETE /api/v1/users/:id
// @access  Private
exports.deleteUser = factory.deleteOne(User);

exports.resizeUserImage = (req, res, next) => {
  if (!req.file) return next();
  // console.log('resize Called');
  req.file.finame = `user-${req.user.id}-${Date.now()}.jpeg`;
  // image processing
  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.finame}`);

  next();
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
// desc      Current user to update user releted stuff
// @router  PATCH /api/v1/users/updateMe
// @access  Private
exports.updateMe = asyncHandler(async (req, res, next) => {
  // console.log(req.file);
  // console.log(req.body);
  // 1) Create error if user POTs password data

  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new ErrorResponse(
        'This is not for password updated. Please use /password_update'
      ),
      400
    );
  }
  // Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.finame;

  // 2) Update user doccument,
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});
