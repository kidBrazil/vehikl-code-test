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
  paid_on: {
    type: Date,
    default: null
  },
  ticket_rate: {
    type: Number,
    default: 3
  }
});

// Export models
module.exports = mongoose.model('Tickets', IssuedTicket);
