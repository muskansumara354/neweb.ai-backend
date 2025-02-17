// controllers/webhookController.js

const User = require('../models/user.model');
const catchAsync = require("express-async-handler");
const AppError = require("../utils/AppError")

const webhookController = {

  handleUserCreated: catchAsync(async (req, res, next) => {
    const {
      id: clerkId,
      email_addresses,
      first_name,
      last_name,
      image_url
    } = req.webhookEvent.data;

    // Get primary email
    const primaryEmail = email_addresses.find(email => email.id === req.webhookEvent.data.primary_email_address_id);

    // Check if user already exists
    const existingUser = await User.findOne({ clerkId });
    if (existingUser) {
      return res.status(200).json({
        status: 'success',
        message: 'User already exists',
        data: { user: existingUser }
      });
    }

    // Create new user
    const newUser = new User({
      clerkId: clerkId,
      email: email_addresses[0]?.email_address, // Extract primary email
      name: { firstName: first_name, lastName: last_name },
      profileImage: image_url,
    });
    await newUser.save();
    console.log(`Successfully created user with clerk ID ${clerkId}`);

    return res.status(201).json({
      status: 'success',
      message: 'User successfully created',
      data: { user: newUser }
    });
  }),

  handleUserUpdated: catchAsync(async (req, res, next) => {
    const {
      id: clerkId,
      email_addresses,
      first_name,
      last_name,
      image_url
    } = req.webhookEvent.data;

    // Find user and update details
    const updatedUser = await User.findOneAndUpdate(
      { clerkId },
      {
        email: email_addresses[0]?.email_address,
        name: { firstName: first_name, lastName: last_name },
        profileImage: image_url,
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      console.warn(`User with clerk ID ${clerkId} not found in database`);
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }

    console.log(`Successfully updated user with clerk ID ${clerkId}`);
    return res.status(200).json({
      status: 'success',
      message: 'User successfully updated',
      data: { user: updatedUser }
    });
  }),

  handleUserDeleted: catchAsync(async (req, res, next) => {
    const { id: clerkId } = req.webhookEvent.data;

    const deletedUser = await User.findOneAndDelete({ clerkId });

    if (!deletedUser) {
      console.warn(`User with clerk ID ${clerkId} not found in database`);
      return res.status(200).json({
        status: 'success',
        message: 'No matching user found to delete'
      });
    }

    console.log(`Successfully deleted user with clerk ID ${clerkId}`);
    return res.status(200).json({
      status: 'success',
      message: 'User successfully deleted',
      data: { clerkId, deletedUserId: deletedUser._id }
    });
  }),

  routeWebhookEvent: catchAsync(async (req, res, next) => {
    const event = req.webhookEvent;

    switch (event.type) {
      case 'user.created':
        return await webhookController.handleUserCreated(req, res, next);
      case 'user.updated':
        return await webhookController.handleUserUpdated(req, res, next);
      case 'user.deleted':
        return await webhookController.handleUserDeleted(req, res, next);
      default:
        return res.status(200).json({
          status: 'success',
          message: 'Webhook received but no action required'
        });
    }
  })
};

module.exports = webhookController;
