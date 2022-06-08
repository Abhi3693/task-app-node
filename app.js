const express = require('express');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
var cors = require('cors');
require('dotenv/config');

const tasksRouter = require('./routes/tasks');
const usersRouter = require('./routes/users');

// Connect to database
mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.DB_CONNECTION)
  .then((res) => console.log('Connected to DB'))
  .catch((err) => console.log(err));

// Instantiate app
const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Cors config
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

// Routes
app.use('/api/tasks', tasksRouter);
app.use('/api/users', usersRouter);

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
