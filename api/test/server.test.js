let mongoose = require('mongoose'),
    Capacity = require('../models/lotCapacityModel'),
    Tickets = require('../models/ticketModel'),
    chai = require('chai')
    chaiHttp = require('chai-http')
    should = chai.should()
    expect = chai.expect;

chai.use(chaiHttp);

var boot = require('../app').boot,
  shutdown = require('../app').shutdown,
  port = require('../app').port,

describe('Get Ticket Issued', function() {
  before(function () {
    boot();
  });
  describe('[POST] /tickets', function() {
    chai.request('localhost:3000').post('/tickets').send({})
    .end((err, response) => {
      expect(response.status).to.equal(200);
      done();
    })
  });
  after(function () {
    shutdown();
  });
});
