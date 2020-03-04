const fs = require('fs');
const express = require('express');

const app = express();

// MIDDLEWARE
app.use(express.json());

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Routing
// desc      Get all tours
// @router  GET /api/v1/tours
// @access  Public
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours }
  });
});
// desc      Get Single tours
// @router  GET /api/v1/tours/:id
// @access  Public
app.get('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id'
    });
  }
  res.status(200).json({
    status: 'success',
    data: { tour }
  });
});

// desc      Create a tour
// @router  POST /api/v1/tours
// @access  Private
app.post('/api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      res.status(201).json({
        status: 'success',
        data: {
          newTour
        }
      });
    }
  );
});

// desc      Update Tour
// @router  PATCH /api/v1/tours/:id
// @access  Private
app.patch('/api/v1/tours/:id', (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id'
    });
  }
  res.status(200).json({
    status: 'success',
    data: { tour: '<Updated Tour>' }
  });
});

// desc      Delete Tour
// @router  DELETE /api/v1/tours/:id
// @access  Private
app.delete('/api/v1/tours/:id', (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id'
    });
  }
  res.status(204).json({
    status: 'success',
    data: null
  });
});
