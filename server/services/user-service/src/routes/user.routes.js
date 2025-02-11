const userController = require('../controllers/user.controller');
const { requireAuth } = require('@clerk/express');
const express = require("express")
const router = express.Router();

router
  .route('/')
  .post(userController.createNewUser)
router
    .route('/me')
    .get(requireAuth(), userController.getUser)

module.exports = router;

