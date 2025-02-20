const userController = require('../controllers/user.controller');
const { requireAuth } = require('@clerk/express');
const express = require("express")
const router = express.Router();

router
  .route('/')
  .post(userController.createNewUser)
  .get(userController.getAllUsers)
router
    .route('/me')
    .get(requireAuth(), userController.getUser)

router.post("/email",userController.getUserByEmail)

router.post("/send-contact-email",userController.sendContactMail)




module.exports = router;

