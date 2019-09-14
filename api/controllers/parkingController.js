'use strict';

// Pull in Mongoose Model
var mongoose = require('mongoose'),
  Capacity = mongoose.model('Capacity'),
  Tickets = mongoose.model('Tickets');

// Issue Ticket function ----------------------
// This endpoint will trigger a call to the database to
// check if there are any available spots. If there are available
// spots the user will receive a ticket number. Otherwise the user
// will receive a 210 status code and a FALSE for the ticket payload.
//
// If the ticket is created successfully the timestamp should be saved to be used for rate calculations later.
exports.issue_ticket = function(req, res) {
  console.log('Ticked Issued');
  res.json({ message: 'Ticked Issued' });
};

exports.total_owed = function(req, res) {
  console.log('Ticked Owed');
  res.json({ message: 'Total Owed' });
};

exports.pay_ticket = function(req, res) {
  console.log('Ticked Paid');
  res.json({ message: 'Ticked Paid' });
};
