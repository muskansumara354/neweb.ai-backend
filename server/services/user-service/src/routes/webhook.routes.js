// routes/webhookRoutes.js

const express = require('express');
const bodyParser = require('body-parser');
const webhookController = require('../controllers/webhook.controller');
const { verifyWebhookSignature } = require('../middlewares/webhook.middleware');

const router = express.Router();

// Webhook route with middleware chain
router.post(
  '/',
  bodyParser.raw({ type: 'application/json' }),
  verifyWebhookSignature,
  webhookController.routeWebhookEvent
);

module.exports = router;