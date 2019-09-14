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
  // Init Variables.
   let spots = null,
    taken = null,
    ticketId = null,
    lotId = null;

  // Get current Lot Capacity ---------------------
  // Will set vacancy to true/false based on capcity left.
  Capacity.find({}, function(err, capacity) {
    if (err) {
      res.send(err);
    }
    else {
      spots = capacity[0].lot_capacity;
      taken = capacity[0].spots_alocated;
      lotId = capacity[0].id;
      // Check if there are still spots free..
      (spots - taken > 0 ) ? createTicket() : denyTicket();
      console.log('CHECKING VACANCY ----------------------------');
      console.log(spots);
      console.log(taken);
    }
  });

  // Create Ticket Funcion
  function createTicket() {
    // Model Ticket - We only need creation time at this stage
    var ticket = new Tickets({
      // Could potentially add other data here in the future,
      // license plate from a reader.. that type of thing.
      created: Date.now()
    });

    ticket.save(function (err, ticket) {
      if (err) return console.error(err);
      console.log("CREATING TICKET -----------------------");
      console.log("Ticket ID: " + ticket.id);
      res.send(ticket);
    });
  }

  // Deny Ticket Function
  function denyTicket() {
    console.log('NO CAPCITY -----------------------------');
    res.json({ message: 'Sorry but there is no spots left, please try again later!' });
  }
};

exports.total_owed = function(req, res) {
  console.log('Ticked Owed');
  res.json({ message: 'Total Owed' });
};

exports.pay_ticket = function(req, res) {
  console.log('Ticked Paid');
  res.json({ message: 'Ticked Paid' });
};
