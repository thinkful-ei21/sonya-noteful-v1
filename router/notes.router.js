'use strict';

const express = require('express');

const router = express.Router();

// const bodyParser = require('body-parser');
// const jsonParser = bodyParser.json();



const data = require('../db/notes.json');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);


// Get All (and search by query)
router.get('/notes', (req, res, next) => {
  const {searchTerm} = req.query;

  notes.filter(searchTerm, (err, list) => {
    if(err) {
      return next(err);
    }
    res.json(list);
  });
});

// Get a single item
router.get('/notes/:id', (req, res, next) => {
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

router.put('/notes/:id', (req, res, next) => {
  const id = req.params.id;

  /******Never trust users - validate input*******/

  const updateObj = {};
  const updateFields = ['title', 'content'];

  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  notes.update(id, updateObj, (err, item) => {
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

module.exports = router;