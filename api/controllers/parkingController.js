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
      console.log('[ CHECKING VACANCY ] ----------------------------');
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
              console.log('[ Capacity Updated Successfully. ]');
              console.log("[ New Ticket Issued ]  -----------------------");
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
    console.error('[NO VACANCY] -----------------------------');
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
      requestTime = Date.now();
  // Get current Lot Capacity ------------------------------------
  // Will set vacancy to true/false based on capcity left.
  Tickets.find({_id: ticketId}, function(err, ticket) {
    // Variables
    let createdTime = null,
        ticketRate = null;

    if (err) {
      // Error ...
      res.send(err);
    }
    else {
      // Success
      createdTime = ticket[0].created;
      ticketRate = ticket[0].ticket_rate;
      // Calculate the rate.
      res.json({ total: calculateRate( ticketRate, createdTime, requestTime ) });
    }
  });

  // Calculate The Rate ....
  function calculateRate(rate, created, requested) {
    // Calculate Rate Function ----------------------------------------
    // Takes in 3 arguments in order to calculate the amount owed by the client.
    //
    // rate: Comes directly from the ticket and represents the dollars / hour cost.
    // created: Receives date from database in Timestamp so must be converted to millis.
    // requested: Comes in as standard millis ready to calculate.
    var total = null;
    // Convert Created to Millis.
    created = created.getTime();
    // Get the difference in time in minutes
    let delta = Math.ceil( (requested - created) / 60000);
    let rateMinute = rate / 60;


    // Over 1 Hour...Less than 3
    if ( delta > 60 && delta < 119 ) {
      rateMinute = (rateMinute * 1.5);
    }
    // Over 3 Hours...Less than 6
    else if ( delta >= 120 && delta < 360) {
      rateMinute = (rateMinute * 2.25)
    }
    // All Day
    else if ( delta > 361) {
      rateMinute = (rateMinute * 3.5)
    }
    // Return Total...
    return total = (delta * rateMinute).toFixed(2);
  }
};

exports.pay_ticket = function(req, res) {
  console.log('Ticked Paid');
  res.json({ message: 'Ticked Paid' });
};
