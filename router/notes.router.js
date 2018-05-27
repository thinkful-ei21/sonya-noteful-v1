'use strict';

const express = require('express');

//Create a router instance (aka 'mini-app')
const router = express.Router();


// simple in-memory DATABASE
const data = require('../db/notes');
const simDB = require('../db/simDB');  
const notes = simDB.initialize(data);

router.get('/notes', (req, res, next) => {
  // const searchParam = req.query.searchTerm;
  // const filteredSearch = data.filter(note => note.title.includes(searchParam));
  // res.json(filteredSearch);

  // const {searchTerm} = req.query;
  // notes.filter(searchTerm, (err, list) => {
  //    if (err) {
  //      return next(err); // goes to error handler
  //    }
  //    res.json(list); // responds with filtered array
  //  });

  const {searchTerm} = req.query;
  notes.filter(searchTerm)
    .then(list => {
      if (list) {
        res.json(list);
      }
    })
    .catch(err => {
      next(err);
    });
});

// Get a single item
router.get('/notes/:id', (req, res, next) => {
  const id = req.params.id;

  notes.find(id)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});

//Put update an item
router.put('/notes/:id', (req, res, next) => {
  const id = req.params.id;

  const updateObj = {};
  const updateableFields = ['title', 'content'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  /***** Never trust users - validate input *****/

  if (!updateObj.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 404;
    return next(err);
  }

  notes.update(id, updateObj)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

// notes.update(id, updateObj, (err, item) => {
//   if (err) {
//     return next(err);
//   }
//   if (item) {
//     res.json(item);
//   } else {
//     next();
//   }
// });

//Post/insert an item
router.post('/notes', (req, res, next) => {
  const { title, content } = req.body;

  const newItem = { title, content };
  /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }
  
  notes.create(newItem)
    .then(item => {
      if (item) {
        res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
      }
    })
    .catch(err => {
      next(err);
    });
});
//   notes.create(newItem, (err, item) => {
//     if (err) {
//       return next(err);
//     }
//     if (item) {
//       res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
//     } else {
//       next();
//     }
//   });
// });

  

//Delete an item
router.delete('/notes/:id', (req, res, next) => {

  notes.delete(req.params.id)
    .then(note => {
      if (note) {
        res.json(note);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});
	
//   notes.delete(req.params.id, (err, len) => {
//     if (err) {
//       res.status(500).end();
//     } else {
//       if (len) {
//         res.status(204).end();
//       } else {
//         res.status(404).end();
//       }
//     }
//   });
// });








// router.get('/boom', (req, res, next) => {
//   throw new Error('Boom!!');
// });









module.exports = router;