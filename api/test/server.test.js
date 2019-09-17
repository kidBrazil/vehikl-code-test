let mongoose = require('mongoose'),
    app = require('../server.js'),
    Capacity = require('../models/lotCapacityModel'),
    Tickets = require('../models/ticketModel'),
    chai = require('chai'),
    chaiHttp = require('chai-http'),
    assert = require('assert'),
    should = chai.should(),
    expect = chai.expect,
    generatedTicket = null;

chai.use(chaiHttp);

describe('Test Server Endpoints', function(done) {
  // Generate Ticket Endpoint
  describe('[POST] /tickets', function() {
    // Wait for the server to start up...
    this.timeout(30000);

    // Test the ticket..
    it('Creates and returns a ticket', (done) => {
      chai.request('localhost:3000').post('/tickets').send({})
      .end((err, response) => {
        if (err) {
          done(err);
        }
        // Check that the backend responded..
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('paid');
        response.body.should.have.property('ticket_rate');
        response.body.should.have.property('paid_on');
        response.body.should.have.property('created');
        response.body.should.have.property('lot_id');
        response.body.should.have.property('_id');

        generatedTicket = response.body._id;
        console.log(generatedTicket);
        done();
      });
    })
  });

  // Return Ticket Total
  describe('[GET] /tickets/:ticket', function() {

    // Test the ticket..
    it('Gets the ticket total', (done) => {
      chai.request('localhost:3000').get('/tickets/' + generatedTicket).send({})
      .end((err, response) => {
        if (err) {
          done(err);
        }
        // Check that the backend responded..
        console.log(response);
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('total');
        done();
      });
    })
  });
});
