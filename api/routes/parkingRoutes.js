'use strict';
module.exports = function(app) {
  var parkingController = require('../controllers/parkingController');

  // Get Ticket Endpoint
  app.route('/tickets')
    .post(parkingController.issue_ticket);

  // Return Amount Owed Endpoint
  app.route('/tickets/:ticket')
    .get(parkingController.pay_ticket);

  // Pay Ticket Endpoint
  app.route('/payments/:ticket')
    .post(parkingController.pay_ticket);
};
