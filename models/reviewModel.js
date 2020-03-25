const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createAt: {
      type: Date,
      default: Date.now()
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.']
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.pre(/^find/, function(next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name'
  // })
  this.populate({
    path: 'author',
    select: 'name photo'
  });
  next();
});

// Static Methods
reviewSchema.statics.calcAverageRatings = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  // console.log(stats);
  if (stats > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

reviewSchema.post('save', function() {
  // this points to current review
  this.constructor.calcAverageRatings(this.tour); // coz Review is not yet declared
  // next();
});
/**
 * because this is the query middleware, it points to the query not the doc,
 * hence we use `this.findOne` to get access the doc being processed, before the query is done excutting,
 * and we save the result(doc) into the 'this.alterdReview'
 * ==>> this ~ this.alterdReview
 */
reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.alterdReview = await this.findOne();
  next();
});
reviewSchema.post(/^findOneAnd/, async function() {
  //Post middleware do not have a next function
  await this.alterdReview.constructor.calcAverageRatings(
    this.alterdReview.tour
  );
});
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
