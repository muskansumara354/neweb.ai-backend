const dotenv = require('dotenv');
const mongoose = require('mongoose');
//import { Clerk } from '@clerk/clerk-js'

dotenv.config({ path: './src/config/config.env' });
const app = require('./app');


mongoose
  .connect(process.env.DATABASE_CONNECTION_STRING)
  .then((val) => {
    console.log(`Connected to database`);
  })
  .catch((err) => {
    console.log(`Something went wrong! Can't connect to database.`);
    console.log(`Error: ${err}`);
  });
app.get("/", (req, res) => {
    res.sendFile(__dirname+"/public/index.html");
});
port=3000
//server code
const server = app.listen(port, () => {
    console.log(`User Server listing on http://localhost:${port}`);
  });


