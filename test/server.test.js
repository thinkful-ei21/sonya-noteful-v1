'use strict';

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Reality check', function () {

  it('true should be true', function () {
    expect(true).to.be.true;
  });

  it('2 + 2 should equal 4', function () {
    expect(2 + 2).to.equal(4);
  });

});

describe('Express static', function () {

  it('GET request "/" should return the index page', function () {
    return chai.request(app)
      .get('/')
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      });
  });

});

describe('404 handler', function () {

  it('should respond with 404 when given a bad path', function () {
    return chai.request(app)
      .get('/DOES/NOT/EXIST')
      .then(res => {
        expect(res).to.have.status(404);
      });
  });

});

describe('GET api/notes', function () {

  it.only('should display all notes', function () {
    return chai.request(app)
      .get('/api/notes')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('array');
        const noteKeys = ['id', 'title', 'content'];
        res.body.forEach(function(note) {
          expect(note).to.be.a('object');
          expect(note).to.include.keys(noteKeys);
        });
        
      });
  });
  it.only('should display notes containing specified query', function () {
    return chai.request(app)
      .get('/api/notes?searchTerm=life')
      .then(function (res) {
        expect(res).to.be.json;
        console.log(res.body[0].title);
        expect(res.body[0].title).to.include('life');
      });
  });
  it.only('should return empty array for an incorrect query', function() {
    return chai.request(app)
      .get('/api/notes?searchTerm=fine')
      .then(function (res) {
        expect(res.body).to.deep.equal([]);
      });
  });
});

// describe('GET /api/notes/:id', function () {
//   it('should return note matching id param', function() {
//     return chai.request(app)
//       .get('/api/notes/1005')
//       .then(function (res) {
//         expect(res).to.be.a('object');
//         expect(res).to.be.json;
//         expect(res).to.have.status(200);
//         expect(res.body.title).to.equal('10 ways cats can help you live to 100');
//         expect(res.body.content).to.equal('Lorem ipsum dolor sit amet, boring consectetur adipiscing elit, sed do eiusmod tempo incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');
//       });
//   });
// });
