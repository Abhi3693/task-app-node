const express = require("express");
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require("mongoose");
require("dotenv/config");


const tasksRouter = require('./routes/tasks');
const usersRouter = require('./routes/users');

// Connect to database
mongoose.connect(process.env.DB_CONNECTION, (err) => {
  console.log(err ? err : "connected to DB!");
});

// Instantiate app
const app = express();

// middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/tasks', tasksRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error: err });
});

// listening to port
app.listen(process.env.PORT || 3000);