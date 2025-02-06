const userController = require('../controllers/user.controller');
const express = require("express")
const router = express.Router();

router
  .route('/')
  .post(userController.createNewUser)

module.exports = router;

