// const ErrorResponse = require('../utils/ErrorResponse');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require('../middleware/asyncHandler');
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const factory = require('./handlerFactory');

exports.getCheckoutSession = asyncHandler(async (req, res, next) => {
  // 1. Get the current booked tour
  const tour = await Tour.findById(req.params.tourID);

  // 2. Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourID
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourID,
    line_items: [
      {
        name: `${tour.name} tour`,
        description: tour.summary,
        images: [`https://www.sote.or.tz/img/tours/${tour.imageCover}`],
        amount: tour.price * 100, //convert to cents
        currency: 'usd',
        quantity: 1
      }
    ]
  });
  // 3. Create session response

  res.status(200).json({
    status: 'success',
    session
  });
});

exports.createBookingCheckout = asyncHandler(async (req, res, next) => {
  // This is only Tempo because is not secure, b'se everyone can make booking without paying
  const { tour, user, price } = req.query;
  if (!tour && !user && !price) return next();
  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.createBooking = factory.createOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
