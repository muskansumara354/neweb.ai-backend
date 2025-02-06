const express=require("express")
const cors = require("cors")
const helmet = require("helmet")
const path = require("path")
const { clerkMiddleware } = require('@clerk/express');
const userRouter = require('./routes/user.routes');
const webhookRouter = require('./routes/webhook.routes');

const cookieParser = require('cookie-parser');

const app = express();

//middlewares
app.use(
  cors({
    origin: ["*"],
    methods: ['GET', 'POST', 'UPDATE', 'DELETE'],
    credentials: true,
  }),
);
app.use(clerkMiddleware())
app.use(express.static(path.join(__dirname, "/src/public")));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/webhook', webhookRouter);


module.exports = app;