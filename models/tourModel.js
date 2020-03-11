const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      required: [true, 'A tour must have a name']
    },
    slug: String,
    price: {
      type: Number,
      required: [true, 'A tour must have a Price']
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty level']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a Maximum Group size']
    },
    ratingsAverage: {
      type: Number,
      default: 4.5
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover photo']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now()
      //select: false //do not return this to user, default is true
    },
    startDates: [Date],
    secretTour: {
      type: String,
      default: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// virtual properties => fields which are not saved into the db to save space
tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

/**
 * there're four types of middleware in mongoose,
 * 1:) Document Middleware
 * 2:) Query Middleware
 * 3:) Aggrigate Middleware
 * 4:) Modal Middleware
 */

// 1:) Document Middleware -> runs before .save() and .create(), but not on .insertMany() methods
tourSchema.pre('save', function(next) {
  // 'this' key word points to the current document
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// })

// 2:) Query Middleware -> allows to run a func after a query
tourSchema.pre(/^find/, function(next) {
  // avoid certain resources to a certain people/call
  // 'this' key word points to the current query
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});
tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took: ${Date.now() - this.start} milliseconds`);
  // console.log(docs);
  next();
});

// 3:) Aggrigate Middleware
tourSchema.pre('aggregate', function(next) {
  // 'this' key word points to the current aggrigation object
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this);
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
