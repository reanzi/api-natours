// Modular
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // methods
  filter() {
    const queryObj = { ...this.queryString }; // destructuring all parameters form req.query int queryObj
    const excluddFields = ['page', 'sort', 'limit', 'fields'];
    excluddFields.forEach(el => delete queryObj[el]);

    // 1B:) Advance Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    // console.log(JSON.parse(queryStr));
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v -passwordResetRequested'); // exlude __v
    }
    return this;
  }

  pagenate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

//BUILD THE QUERY
// 1A:) Filtering
// const queryObj = { ...req.query }; // destructuring all parameters form req.query int queryObj
// const excluddFields = ['page', 'sort', 'limit', 'fields'];
// excluddFields.forEach(el => delete queryObj[el]);

// // 1B:) Advance Filtering
// let queryStr = JSON.stringify(queryObj);
// queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
// // console.log(JSON.parse(queryStr));

// let query = Tour.find(JSON.parse(queryStr));
// 2:) SORTING
// if (req.query.sort) {
//   const sortBy = req.query.sort.split(',').join(' ');
//   query = query.sort(sortBy);
// } else {
//   query = query.sort('-createdAt');
// }

// 3:) FIELD LIMITING
// if (req.query.fields) {
//   const fields = req.query.fields.split(',').join(' ');
//   query = query.select(fields);
// } else {
//   query = query.select('-__v'); // exlude __v
// }

// 4:) PAGINATIONS and RESULT SET
// const page = req.query.page * 1 || 1;
// const limit = req.query.limit * 1 || 2;
// const skip = (page - 1) * limit;
// query = query.skip(skip).limit(limit);

// if (req.query.page) {
//   const numTours = await Tour.countDocuments();
//   if (skip >= numTours) throw new Error('This page Does not Exist');
// }

module.exports = APIFeatures;
