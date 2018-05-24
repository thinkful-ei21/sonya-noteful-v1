'use strict';

const express = require('express');
const router = express.Router();


//DATABASE
const data = require('../db/notes');
const simDB = require('../db/simDB');  
const notes = simDB.initialize(data);


router.put('/notes/:id', (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateFields = ['title', 'content'];

  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  notes.update(id, updateObj)
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


router.get('/notes/:id', (req, res, next) => {
  // const findNoteById = data.find(note => note.id === Number(req.params.id));
  // if(findNoteById) {
  // 	res.json(findNoteById);	
  // } else {
  // 	var err = new Error('Not Found');
  //   err.status = 404;
  //   res.status(404).json({ message: 'Not Found' });
  // }


// 	notes.find(req.params.id, (err, list) => {
// 		if (err) {
// 			return next(err);
// 		}
// 		res.json(list);
// 	});
// });
  notes.find(req.params.id)
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




// router.get('/boom', (req, res, next) => {
//   throw new Error('Boom!!');
// });









module.exports = router;