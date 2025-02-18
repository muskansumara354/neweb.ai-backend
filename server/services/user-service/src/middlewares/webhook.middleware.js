// middlewares/webhookMiddleware.js

const { Webhook } = require('svix');
const AppError = require("../utils/app_error")


const verifyWebhookSignature = async (req, res, next) => {
  // Verify environment variables
  const SIGNING_SECRET = process.env.SIGNING_SECRET;
  if (!SIGNING_SECRET) {
    return next(new AppError('Missing SIGNING_SECRET in environment variables', 500));
  }

  const webhook = new Webhook(SIGNING_SECRET);

  // Extract headers
  const svixHeaders = {
    'svix-id': req.headers['svix-id'],
    'svix-timestamp': req.headers['svix-timestamp'],
    'svix-signature': req.headers['svix-signature']
  };

  // Validate required headers
  if (!svixHeaders['svix-id'] || !svixHeaders['svix-timestamp'] || !svixHeaders['svix-signature']) {
    return next(new AppError('Missing required Svix headers', 400));
  }

  try {
    // Verify webhook signature and attach to request
    const event = webhook.verify(JSON.stringify(req.body), svixHeaders);
    req.webhookEvent = event;
    next();
  } catch (err) {
    console.error('Webhook verification failed:', err.message);
    return next(new AppError('Invalid webhook signature', 400));
  }
};

module.exports = {
  verifyWebhookSignature
};