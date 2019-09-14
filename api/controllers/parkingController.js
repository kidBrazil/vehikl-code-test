'use strict';

// Pull in Mongoose Model
var mongoose = require('mongoose'),
  Capacity = mongoose.model('Capacity'),
  Tickets = mongoose.model('Tickets');

// Issue Ticket function --------------------------------------------
// This endpoint will trigger a call to the database to
// check if there are any available spots. If there are available
// spots the user will receive a ticket number. Otherwise the user
// will receive a 210 status code and a FALSE for the ticket payload.
//
// If the ticket is created successfully the timestamp should
// be saved to be used for rate calculations later.
exports.issue_ticket = function(req, res) {
  // Init Variables.
   let lotId = null,
       baseRate = null;

  // Get current Lot Capacity ------------------------------------
  // Will set vacancy to true/false based on capcity left.
  Capacity.find({}, function(err, capacity) {
    if (err) {
      // Error ...
      res.send(err);
    }
    else {
      // Success...
      let spots = capacity[0].lot_capacity,
      takenSpots = capacity[0].spots_alocated,
      // Update Variables
      lotId = capacity[0].id;
      baseRate = capacity[0].base_rate;
      // Check if there are still spots free..
      (spots - takenSpots > 0 ) ? createTicket() : denyTicket();
      console.log('CHECKING VACANCY ----------------------------');
      console.log('Capacity:' + spots);
      console.log('Spots Taken:' + takenSpots);
    }
  });

  // Create Ticket Funcion ------------------------------------------
  function createTicket() {
    // Model Ticket - We only need creation time at this stage
    var ticket = new Tickets({
      // Could potentially add other data here in the future,
      // license plate from a reader.. that type of thing.
      created: Date.now(),
      ticket_rate: baseRate
    });
    // Save ticket to DB
    ticket.save(function (err, ticket) {
      if (err) {
        // Error...
        return console.error(err);
      }
      else {
        // Success...
        // Update capcity count of spots taken.
        Capacity.update( lotId ,
          {
            $inc: { spots_alocated: 1 }
          },
          {new: true},
          function (err, capacity) {
            if (err){
               return console.error(err);
            }
            else {
              console.log('Capacity Updated Successfully.');
              console.log(capacity);
              console.log("New Ticket Issued  -----------------------");
              console.log("Ticket ID: " + ticket.id);
              res.send(ticket);
            }
          }
        );
      }
    });
  }
  // Deny Ticket Function -----------------------------------------------------
  function denyTicket() {
    console.error('NO CAPCITY -----------------------------');
    res.json({ message: 'Sorry but there is no spots left, please try again later!' });
  }
};

exports.total_owed = function(req, res) {
  // Issue Ticket function --------------------------------------------
  // This endpoint will trigger a call to the database
  // to determine when the ticket was created.
  // It will then check that against the current time
  // and generate a cost estimate based on the preestablished rates.
  // The endpoint will then return the amount owed in dollars.
  //--------------------------------------------------------------------

  // Variables
  let ticketId = req.params.ticket,
      requestTime = Date.now(),
      createdTime = null,
      ticketRate = null;
  // Get current Lot Capacity ------------------------------------
  // Will set vacancy to true/false based on capcity left.
  Tickets.find({_id: ticketId}, function(err, ticket) {
    if (err) {
      // Error ...
      res.send(err);
    }
    else {
      // Success
      calculateRate();
    }
  });

  function calculateRate() {
    console.log('Calculating');
    res.json({ message: 'Calculating' });
  }
  console.log('Ticked Owed');
  console.log(req.params.ticket);
};

exports.pay_ticket = function(req, res) {
  console.log('Ticked Paid');
  res.json({ message: 'Ticked Paid' });
};
