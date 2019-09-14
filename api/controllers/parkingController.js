'use strict';

// Pull in Mongoose Model
var mongoose = require('mongoose'),
  Capacity = mongoose.model('Capacity'),
  Tickets = mongoose.model('Tickets');

// Issue Ticket function
exports.issue_ticket = function(req, res) {
  console.log('Issued Ticket');
  res.json({ message: 'Ticket Issued' });
};

exports.total_owed = function(req, res) {
  console.log('Total Owed');
  res.json({ message: 'Total Owed' });
};

exports.pay_ticket = function(req, res) {
  console.log('Ticked Paid');
  res.json({ message: 'Ticked Paid' });
};
