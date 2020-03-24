const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./../models/userModel');
// const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      required: [true, 'A tour must have a name'],
      maxLength: [40, 'A tour must have less or equal to 40 characters'],
      minLength: [40, 'A tour must have greater or equal to 10 characters']
      // validate: [validator.isAlpha, 'A Tour name can not contain numbers']
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
      required: [true, 'A tour must have a difficulty level'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium or difficult'
      }
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a Maximum Group size']
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be less or equal to 5.0']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          //this only points to the current doc on New doc creation not on Updates
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) must be less than the actual price'
      }
    },
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
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: { type: String, default: 'Point', enum: ['Point'] },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    // guides: Array // using embedding
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }] // using child refferencing
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

// Virtual Populated
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
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

// // EMBEDING USER DATA INTO A TOUR DATA
// tourSchema.pre('save', async function(next) {
//   const guidesPromises = this.guides.map(
//     async id => await User.findById(id).select('-passwordResetRequested')
//   );
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });
// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// })

// // REFFERENCING USER DATA INTO A TOUR DATA
// 2:) Query Middleware -> allows to run a func after a query
tourSchema.pre(/^find/, function(next) {
  // avoid certain resources to a certain people/call
  // 'this' key word points to the current query
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

// If needed to populate in every query
// tourSchema.pre(/^find/, function(next) {
//   this.populate({
//     path: 'guides',
//     select: '-__v -passwordResetRequested'
//   });
//   next();
// });

tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took: ${Date.now() - this.start} milliseconds`);
  // console.log(docs);
  next();
});

// 3:) Aggrigate Middleware
tourSchema.pre('aggregate', function(next) {
  // 'this' key word points to the current aggrigation object
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  // console.log(this);
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
