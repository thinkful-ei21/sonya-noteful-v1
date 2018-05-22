'use strict';

// Load array of notes
const express = require('express');


const data = require('./db/notes');
const simDB = require('./db/simDB');
const notes = simDB.initialize(data);

const {myLogger} = require('./middleware/logger');

const {PORT} = require('./config');

const app = express();

app.use(express.static('public'));

app.use(myLogger);

app.get('/api/notes/:id', (req, res, next) => {
  const id = req.params.id;

  notes.find(id, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      next();
    }
  });
});


app.get('/api/notes', (req, res, next) => {
  const {searchTerm} = req.query;

  notes.filter(searchTerm, (err, list) => {
    if(err) {
      return next(err);
    }
    res.json(list);
  });
});


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