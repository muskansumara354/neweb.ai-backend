const axios = require('axios');
const User = require('../models/user.model');
const catchAsync = require("express-async-handler"); // Wrapper to handle async errors
const AppError = require("../utils/app_error");
const APIFeatures = require("../utils/api_features"); // Importing APIFeatures
const Email = require('../utils/email');
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


const sendEmail = async (email, name) => {
  const url = 'https://api.brevo.com/v3/smtp/email';

  const data = {
    sender: {
      name: 'Team Neweb.ai',
      email: 'no.dis.traction4u@gmail.com'
    },
    to: [{ email: email, name: name }],
    subject: 'Thank You for Pre-Registering with Neweb.ai!',
    htmlContent: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="format-detection" content="telephone=no">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank You for Pre-Registering with Neweb.ai!</title>
      <style type="text/css">
        body { width:100% !important; margin:0; padding:0; }
        img { outline:none; text-decoration:none; }
        a img { border:none; }
        table { border-collapse:collapse; }
        p, h1, h2, h3, h4, ol, ul, li { margin: 0; }
        a, a:link { color: #696969; text-decoration: underline }
        .nl2go-default-textstyle { color: #3b3f44; font-family: arial,helvetica,sans-serif; font-size: 16px; line-height: 1.5; word-break: break-word }
      </style>
    </head>
    <body bgcolor="#ffffff" text="#3b3f44" link="#696969" yahoo="fix" style="background-color: #ffffff;">
      <table cellspacing="0" cellpadding="0" border="0" role="presentation" class="nl2go-body-table" width="100%" style="background-color: #ffffff; width: 100%;">
        <tr><td>
          <table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" align="left">
            <tr><td valign="top" style="background-color: #ffffff;">
              <table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" align="center">
                <tr><td style="padding-top: 20px;">
                  <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
                    <tr><th width="100%" valign="top" style="font-weight: normal;">
                      <table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" align="left">
                        <tr><td valign="top">
                          <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
                            <tr><td class="nl2go-default-textstyle" align="left" style="color: #3b3f44; font-family: arial,helvetica,sans-serif; font-size: 16px; line-height: 1.5; word-break: break-word; padding-top: 15px; text-align: left; valign: top;">
                              <div>
                                <p style="margin: 0;"><strong>Hi </strong>${name}<strong>,</strong></p>
                                <p style="margin: 0;"> </p>
                                <p style="margin: 0;">Thank you for pre-registering with Neweb.ai! 🎉</p>
                                <p style="margin: 0;"> </p>
                                <p style="margin: 0;">We’re thrilled to have you on board and can't wait for you to experience our AI-powered website builder. Stay tuned for updates and get ready to create something amazing!</p>
                                <p style="margin: 0;"> </p>
                                <p style="margin: 0;">Best regards,<br>The Neweb.ai Team</p>
                              </div>
                            </td></tr>
                            <tr><td align="left" style="color: #3b3f44; font-family: arial,helvetica,sans-serif; font-size: 16px; line-height: 1.5; word-break: break-word; padding-top: 30px; text-align: left; valign: top;">
                              <div>
                                <p style="margin: 0;">
                                  <a href="{{ unsubscribe }}" style="color: #696969; text-decoration: underline;">Click here to unsubscribe</a>
                                </p>
                              </div>
                            </td></tr>
                          </table>
                        </td></tr>
                      </table>
                    </th></tr>
                  </table>
                </td></tr>
              </table>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </body></html>`,
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    return response;
  } catch (error) {

    return error.response?.data || { error: error.message };
  }
};

const sendContactMail = catchAsync(async (req, res, next) => {
console.log(req.body)
  try {
    const user = {
      email: req.body.user_email,
      fullName: req.body.full_name,
    };

    await new Email(user, '').sendContactForm(
      req.body.subject,
      req.body.message,
      req.body.user_email,
      req.body.mobileNo,
    );
    res.status(200).json({
      status: 'Success',
      message: 'mail sent successfully',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});


module.exports = {
  createNewUser,
  getUser,
  getAllUsers,
  getUserByEmail,
  sendContactMail
};
