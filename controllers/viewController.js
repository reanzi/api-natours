const Tour = require('./../models/tourModel');
const asyncHandler = require('./../middleware/asyncHandler');

exports.getOverview = asyncHandler(async (req, res) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();

  // 2) Build template

  // 3) Render template using tour data from step 1
  res.status(200).render('overview', {
    tours
  });
});

exports.getTour = asyncHandler(async (req, res) => {
  // 1) Get the data for the requested review
  const tour = await await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });
  //   console.log(tour);
  // 2) Build the template

  // 3) Render template using the data from the step 1
  res.status(200).render('tour', {
    // title: tour.name,
    tour
  });
});
