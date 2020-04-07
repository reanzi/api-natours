const asyncHandler = require('./../middleware/asyncHandler');
const ErrorResponse = require('./../utils/ErrorResponse');
const APIFeatures = require('./../utils/apiFeatures');

exports.createOne = Model =>
  asyncHandler(async (req, res, next) => {
    const newDoc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: newDoc
      }
    });
  });
exports.getAll = Model =>
  asyncHandler(async (req, res, next) => {
    // Allow for `Nested` GET reviews on tour (hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    // EXCUTE THE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagenate();
    // const docs = await features.query.explain();
    const docs = await features.query;
    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: { docs }
    });
  });
exports.getOne = (Model, popOptions) =>
  asyncHandler(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions)
      query = query.populate(popOptions).select('-passwordResetRequested');

    const doc = await query;
    if (!doc) {
      return next(new ErrorResponse(`No document found with that ID`, 404));
    }
    res.status(200).json({
      success: true,
      data: { data: doc }
    });
  });
exports.updateOne = Model =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });
    if (!doc) {
      return next(new ErrorResponse(`No document found with that ID`, 404));
    }
    res.status(200).json({
      status: 'success',
      data: { data: doc }
    });
  });

exports.deleteOne = Model =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new ErrorResponse(`No document found with that ID`, 404));
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  });

exports.deactivateUser = Model =>
  asyncHandler(async (req, res, next) => {
    await Model.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
      status: 'success',
      data: null
    });
  });
