'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Ticket Schema
var IssuedTicket = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  paid: {
    type: Boolean,
    default: false
  },
  paidOn: {
    type: Date,
    default: null
  }
});

// Export models
module.exports = mongoose.model('Tickets', IssuedTicket);
