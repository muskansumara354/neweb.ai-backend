const express=require("express")
const cors = require("cors")
const helmet = require("helmet")
const bodyParser= require("body-parser")
const path = require("path")
const { clerkMiddleware } = require('@clerk/express');
const userRouter = require('./routes/user.routes');
const webhookRouter = require('./routes/webhook.routes');
const { Webhook } = require('svix');
const cookieParser = require('cookie-parser');

const app = express();

//middlewares
app.use(cors());

app.use(clerkMiddleware())
app.use(express.static(path.join(__dirname, "/src/public")));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/webhooks', webhookRouter);


//app.post(
//  '/api/webhooks',
//
//  bodyParser.raw({ type: 'application/json' }),
//
//
//  async (req, res) => {
//
//    const SIGNING_SECRET = process.env.SIGNING_SECRET
//    console.log(SIGNING_SECRET)
//
//    if (!SIGNING_SECRET) {
//      throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env')
//    }
//
//    // Create new Svix instance with secret
//    const wh = new Webhook(SIGNING_SECRET)
//
//    // Get headers and body
//    const headers = req.headers
//    const payload = req.body
//
//    // Get Svix headers for verification
//    const svix_id = headers['svix-id']
//    const svix_timestamp = headers['svix-timestamp']
//    const svix_signature = headers['svix-signature']
//
//    // If there are no headers, error out
//    if (!svix_id || !svix_timestamp || !svix_signature) {
//      return void res.status(400).json({
//        success: false,
//        message: 'Error: Missing svix headers',
//      })
//    }
//
//    let evt
//
//    try {
//      evt = wh.verify(JSON.stringify(payload), {
//        'svix-id': svix_id ,
//        'svix-timestamp': svix_timestamp ,
//        'svix-signature': svix_signature,
//      })
//    } catch (err) {
//      console.log('Error: Could not verify webhook:', err.message)
//      return void res.status(400).json({
//        success: false,
//        message: err.message,
//      })
//    }
//
//    const { id } = evt.data
//    const eventType = evt.type
//    console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
//    console.log('Webhook payload:', evt.data)
//
//    return void res.status(200).json({
//      success: true,
//      message: 'Webhook received',
//    })
//  },
//)


module.exports = app;