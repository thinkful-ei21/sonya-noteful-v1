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

describe('GET /notes', function () {

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
      .get('/api/notes?searchTerm=fine')
      .then(function (res) {
        console.log('does this work?');
      });
  });
});
