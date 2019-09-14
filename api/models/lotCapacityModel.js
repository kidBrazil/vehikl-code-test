'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Lot Capcity
var LotCapcity = new Schema({
  lot_capacity: Number,
  spots_alocated: Number
});

// Export models
module.exports = mongoose.model('Capacity', LotCapcity);
