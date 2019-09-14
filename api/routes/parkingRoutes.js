'use strict';
module.exports = function(app) {
  var parkingController = require('../controllers/parkingController');

  // Get Ticket if space available
  app.route('/tickets')
    .post(parkingController.issue_ticket);

  app.route('/tickets/:ticket')
    .get(parkingController.total_owed);

  app.route('/payments/:ticket')
    .get(parkingController.pay_ticket);
};
