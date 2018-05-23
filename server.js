'use strict';

// Load array of notes
const express = require('express');

const morgan = require('morgan');

const {PORT} = require('./config');

// Create an Express application
const app = express();

const notesRouter = require('./router/notes.router.js');

// parse request body
app.use(express.json());


// logs the http layer
app.use(morgan('dev'));

app.use(express.static('public'));

//mount routers
app.use('/api', notesRouter);

//catch-all 404
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  //res.status(404).json({ message: 'Not Found'});
  next(err);
});

//catch-all Error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error:err
  });
});


app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});