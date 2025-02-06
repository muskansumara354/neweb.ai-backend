const axios = require('axios');
const User = require('../models/user.model');
const catchAsync = require("express-async-handler"); // 1. Wrapper to handle async errors

// Controller function to create a new user
const createNewUser = catchAsync(async (req, res, next) => {
//  console.log(req.body)
  const { id, email_addresses, first_name, last_name, profile_image_url } = req.body;
  // Check if the user already exists in the database
  const existingUser = await User.findOne({ clerkId: id }).lean();
  // 2. `.lean()` returns a plain JavaScript object instead of a Mongoose document, improving performance for read-only queries.

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


module.exports = {
  createNewUser,
};
