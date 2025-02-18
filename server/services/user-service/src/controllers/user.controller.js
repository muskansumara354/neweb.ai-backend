const axios = require('axios');
const User = require('../models/user.model');
const catchAsync = require("express-async-handler"); // Wrapper to handle async errors
const AppError = require("../utils/app_error");
const APIFeatures = require("../utils/api_features"); // Importing APIFeatures

// Controller function to create a new user
const createNewUser = catchAsync(async (req, res, next) => {
  const { id, email_addresses, first_name, last_name, profile_image_url } = req.body;

  // Check if the user already exists in the database
  const existingUser = await User.findOne({ clerkId: id }).lean();
  if (existingUser) {
    return res.status(200).json({ message: 'User already exists' });
  }
  // Set default values for missing user details
  const firstName = first_name || 'Unknown User';
  const lastName = last_name || '';
  const profileImage = profile_image_url || process.env.DEFAULT_PROFILE_IMAGE_URL;

  // Create a new user instance
  const newUser = new User({
    clerkId: id,
    email: email_addresses[0]?.emailAddress, // Extract primary email
    name: { firstName: firstName, lastName: lastName },
    profileImage: profileImage,
  });

  // Save the new user to the database
  await newUser.save();
  console.log('New User Created: ', newUser);

  // Send success response
  res.status(201).json({ message: 'User created successfully' });
});

// Get a single user by ID
const getUser = catchAsync(async (req, res, next) => {
  if (!req.auth || !req.auth.userId) {
    return next(new AppError('Unauthorized Access! Please log in.', 401));
  }

  const user = await User.findOne({ clerkId: req.auth.userId });
  if (!user) {
    return next(new AppError('No Such User Exists or Has Been Deleted!!', 404));
  }

  res.status(200).json({
    status: 'Success',
    user,
  });
});

// Get all users with filtering, sorting, and pagination
const getAllUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const users = await features.query;

  if (!users || users.length === 0) {
    return next(new AppError('No users found in the database.', 404));
  }

  res.status(200).json({
    status: 'Success',
    count: users.length,
    users,
  });
});

// Get user by email
const getUserByEmail = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError('Email parameter is required!', 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError(`User with email "${email}" not found!`, 404));
  }

  res.status(200).json({
    status: 'Success',
    user,
  });
});

module.exports = {
  createNewUser,
  getUser,
  getAllUsers,
  getUserByEmail,
};
