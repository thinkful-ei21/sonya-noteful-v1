'use strict';

// Load array of notes
const express = require('express');

const data = require('./db/notes');

const {PORT} = require('./config');

const app = express();

app.use(express.static('public'));

app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  res.json(data.find(item => item.id === Number(id)));
});

app.get('/api/notes', (req, res) => {
  const searchTerm = req.query.searchTerm;
  if (!searchTerm) {
    res.json(data);
  } else {
    const searchResults = data.filter(note => {
      return note.title.includes(req.query.searchTerm);
    });
  
    res.json(searchResults);
  }
});

app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});