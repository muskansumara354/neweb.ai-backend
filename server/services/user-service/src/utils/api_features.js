//const filterObj = (obj, ...allowedFields) => {
//  const newObj = {};
//  Object.keys(obj).forEach((el) => {
//    if (allowedFields.includes(el)) newObj[el] = obj[el];
//  });
//  return newObj;
//};
const AppError = require('./app_error'); // Import custom AppError

class APIFeatures {
  constructor(query, queryString) {
    this.query = query; // Mongoose query
    this.queryString = queryString; // Request query parameters
  }

  // ✅ Filtering (e.g., ?name=John&age=25)
  filter() {
    try {
      const queryObj = { ...this.queryString };
      const excludedFields = ['page', 'sort', 'limit', 'fields'];
      excludedFields.forEach((el) => delete queryObj[el]);

      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

      this.query = this.query.find(JSON.parse(queryStr));
      return this;
    } catch (error) {
      throw new AppError('Invalid filter query', 400);
    }
  }

  // ✅ Sorting (e.g., ?sort=age,-name)
  sort() {
    try {
      if (this.queryString.sort) {
        const sortBy = this.queryString.sort.split(',').join(' ');
        this.query = this.query.sort(sortBy);
      } else {
        this.query = this.query.sort('-createdAt'); // Default sorting
      }
      return this;
    } catch (error) {
      throw new AppError('Invalid sorting query', 400);
    }
  }

  // ✅ Field Selection (e.g., ?fields=name,email)
  limitFields() {
    try {
      if (this.queryString.fields) {
        const fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select('-__v'); // Exclude internal Mongoose field
      }
      return this;
    } catch (error) {
      throw new AppError('Invalid field selection', 400);
    }
  }

  // ✅ Pagination (e.g., ?page=2&limit=10)
  paginate() {
    try {
      const page = this.queryString.page ? Math.max(1, Number(this.queryString.page)) : 1;
      const limit = this.queryString.limit ? Math.max(1, Number(this.queryString.limit)) : 10;
      const skip = (page - 1) * limit;

      this.query = this.query.skip(skip).limit(limit);
      return this;
    } catch (error) {
      throw new AppError('Invalid pagination query', 400);
    }
  }
}

module.exports = APIFeatures;
