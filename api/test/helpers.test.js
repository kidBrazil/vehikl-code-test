'use strict';
// Testing of helper functions.

var helpers = require('../helpers/helpers');
var assert = require('assert');

// Test payment processing:
// As this is a mock process, we are only expecting a TRUE.
describe('Caulcualte Rate', function(){
  // [Calculate Rate Function] ----------------------------------------
  // Takes in 3 arguments in order to calculate the amount owed by the client.
  //
  // rate: Comes directly from the ticket and represents the dollars / hour cost.
  // created: Receives date from database in Timestamp so must be converted to millis.
  // requested: Comes in as standard millis ready to calculate.

  // < 1 Hour Stay
  it('Should return $1.5 for 30 minute stay', function() {
    assert.equal(helpers.calculate_rate(3, Date.now(), (Date.now() + 1800000)), 1.5);
  });
  // > 1 Hour Stay < 3 Hours
  it('Should return $6.75 for a 90 minute stay', function(){
    assert.equal(helpers.calculate_rate(3, Date.now(), (Date.now() + 5400000)), 6.75);
  });
  // > 3 Hours < 6 Hours..
  it('Should return $15.75 for a 140 minute stay', function(){
    assert.equal(helpers.calculate_rate(3, Date.now(), (Date.now() + 8400000)), 15.75);
  });
  // All Day
  it('Should return $78.75 for a 450 minute stay', function(){
    assert.equal(helpers.calculate_rate(3, Date.now(), (Date.now() + 27000000)), 78.75);
  });
});
