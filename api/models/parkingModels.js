'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Lot Capcity
var LotCapcity = new Schema({
  lot_capacity: Number,
  spots_alocated: Number
});

// Ticket Schema
var IssuedTicket = new Schema({
  ticket: Number,
  created: {
    type: Date,
    default: Date.now
  },
  paid: {
    type: Date,
    default: Date.now
  }
});

// Export models
module.exports = mongoose.model('Capacity', LotCapcity);
module.exports = mongoose.model('Tickets', IssuedTicket);
