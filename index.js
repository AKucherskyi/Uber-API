/* eslint-disable require-jsdoc */

require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const router = require('./routes');

PORT = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use(logger('combined'));

app.use('/api/auth', router.authRouter);
app.use('/api/trucks', router.truckRouter);
app.use('/api/users', router.userRouter);
app.use('/api/loads', router.loadRouter);

async function start() {
  try {
    await mongoose.connect(process.env.DB_CONNECT);
    app.listen(PORT, () => {
      console.log(`Server is listening ${PORT} port`);
    });
  } catch (e) {
    console.log(e);
  }
}
start();
