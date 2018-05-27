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

describe('Noteful App', function() {
  
  // let server;
  // before(function () {
  //   return app.startServer()
  //     .then(instance => server = instance);
  // });

  // after(function () {
  //   return server.stopServer();
  // });

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
});
describe('404 handler', function () {

  it('should respond with 404 when given a bad path', function () {
    return chai.request(app)
      .get('/DOES/NOT/EXIST')
      .catch(err => err.response)
      .then(res => {
        expect(res).to.have.status(404);
      });
  });

});

describe('GET /api/notes', function () {

  it('should display all 10 default notes', function () {
    return chai.request(app)
      .get('/api/notes')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(10);
      });     
  });
  it('should return a list with the correct right fields', function () {
    return chai.request(app)
      .get('/api/notes')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(10);
        const noteKeys = ['id', 'title', 'content'];
        res.body.forEach(function(note) {
          expect(note).to.be.a('object');
          expect(note).to.include.keys(noteKeys);
        });
            
      });
  });
  it('should display notes containing specified query', function () {
    return chai.request(app)
      .get('/api/notes?searchTerm=life')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        console.log(res.body);
        expect(res.body).to.have.length(1);
        console.log(res.body[0].title);
        expect(res.body[0].title).to.include('life');
      });
  });
  it('should return empty array for an incorrect query', function() {
    return chai.request(app)
      .get('/api/notes?searchTerm=fine')
      .then(function (res) {
        expect(res.body).to.deep.equal([]);
      });
  });
});

describe('GET /api/notes/:id', function () {
  it('should return note matching id param', function() {
    return chai.request(app)
      .get('/api/notes/1005')
      .then(function (res) {
        expect(res).to.be.a('object');
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        expect(res.body.title).to.equal('10 ways cats can help you live to 100');
        expect(res.body.content).to.equal('Posuere sollicitudin aliquam ultrices sagittis orci a. Feugiat sed lectus vestibulum mattis ullamcorper velit. Odio pellentesque diam volutpat commodo sed egestas egestas fringilla. Velit egestas dui id ornare arcu odio. Molestie at elementum eu facilisis sed odio morbi. Tempor nec feugiat nisl pretium. At tempor commodo ullamcorper a lacus. Egestas dui id ornare arcu odio. Id cursus metus aliquam eleifend. Vitae sapien pellentesque habitant morbi tristique. Dis parturient montes nascetur ridiculus. Egestas egestas fringilla phasellus faucibus scelerisque eleifend. Aliquam faucibus purus in massa tempor nec feugiat nisl.');
      });
  });
  it('should return 404 for invalid id', function() {
    return chai.request(app)
      .get('/api/notes/star')
      .catch(err => err.response)
      .then(function (res) {
        expect(res).to.have.status(404);
      });
  });
});

describe('POST /api/notes', function () {
  it('should create and return a new item when provided valid data', function() {
    const newData = {title: 'Saturday To Do', content: '25 push ups, cook dinner, buy dishwasher'};
    return chai.request(app)
      .post('/api/notes')
      .send(newData)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'title', 'content');
        expect(res.body.id).to.equal(1010);
        expect(res.body.title).to.equal(newData.title);
        expect(res.body.content).to.equal(newData.content);
        expect(res).to.have.header('location');
      });
  });
  it('should return "Missing title in reuqest body" when missing "title" field', function () {
    const newData = {content: 'Here is a test note'};
    return chai.request(app)
      .post('/api/notes')
      .send(newData)
      .catch(err => err.response)
      .then(function(res) {
        expect(res).to.have.status(400);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.equal('Missing `title` in request body');
      });
  });
});

describe('PUT /api/notes/:id' ,function() {
  it('should update a note when given valid data', function() {
    const newData = {title: 'updated title', content: 'updated content'};
    return chai.request(app)
      .put('/api/notes/1005')
      .send(newData)
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'title', 'content');
        expect(res.body.id).to.equal(1005);
        expect(res.body.title).to.equal(newData.title);
        expect(res.body.content).to.equal(newData.content);
      });
  });
  it('should respond with 404 error for invalid id', function() {
    const newData = {title: 'updated title', content: 'updated content'};
    return chai.request(app)
      .put('/api/notes/doesnotexist')
      .send(newData)
      .then(function (res) {
        expect(res).to.have.status(404);
        expect(res).to.be.json;
      });
  });
  it('should return message "Missing title in request body" when missing the title field', function() {
    const newData = {foo: 'bar'};
    return chai.request(app)
      .put('/api/notes/1005')
      .send(newData)
      .catch(err => err.response)
      .then(function(res) {
        expect(res).to.be.json;
        expect(res).to.be.a('object');
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('Missing `title` in request body');
      });
  });
});

describe('DELETE /api/notes/:id', function() {
  it('should delete an item by given id', function() {
    return chai.request(app)
      .delete('/api/notes/1005')
      .then(function(res) {
        console.log(res.body);
        expect(res.body).to.equal(1);
        expect(res).to.be.json;
        expect(res).to.have.status(200);
      });
  });
});