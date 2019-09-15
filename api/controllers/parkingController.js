'use strict';

// Pull in Mongoose Model
var mongoose = require('mongoose'),
  Capacity = mongoose.model('Capacity'),
  Tickets = mongoose.model('Tickets');

var helpers = require('../helpers/helpers');

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
      (spots - takenSpots > 0 ) ? createTicket(lotId, baseRate) : denyTicket();
      console.log('[ CHECKING VACANCY ] ----------------------------');
      console.log('Capacity:' + spots);
      console.log('Spots Taken:' + takenSpots);
    }
  });

  // Create Ticket Funcion ------------------------------------------
  function createTicket(parkingLot, rate) {
    // Model Ticket - We only need creation time at this stage
    var ticket = new Tickets({
      // Could potentially add other data here in the future,
      // license plate from a reader.. that type of thing.
      created: Date.now(),
      ticket_rate: rate,
      lot_id: parkingLot
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
        Capacity.updateOne( lotId ,
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

exports.pay_ticket = function(req, res) {
  // Issue Ticket function --------------------------------------------
  // This endpoint will trigger a call to the database
  // to determine when the ticket was created.
  // It will then check that against the current time
  // and generate a cost estimate based on the preestablished rates.
  // The endpoint will then return the amount owed in dollars.
  //--------------------------------------------------------------------

  // Variables -- In a real world scenario ticket number would be validated.
  let ticketId = req.params.ticket,
      requestTime = Date.now(),
      totalOwed = null,
      lotId = null,
      // Flag for checking if ticket was previously paid
      ticketPaid = false,
      // reqUrl will route functionality down the line
      reqUrl = req.url;

  // [Get Ticket Information] ------------------------------------
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
      lotId = ticket[0].lot_id;
      ticketPaid = ticket[0].paid;

      // [ /tickets Endpoint ] -------------------------------------------------
      if ( reqUrl.indexOf('tickets') > -1) {
        // If ticket is already paid.. return 0
        if ( ticketPaid ) {
          res.json(
            {
              total: 0
            }
          );
        }
        else {
          // Calculate the rate.
          totalOwed = helpers.calculate_rate( ticketRate, createdTime, requestTime );
          // Return response.
          res.json(
            {
              total: totalOwed
            }
          );
        }
      }
      // [ /payments Endpoint ] -------------------------------------------------
      else if (reqUrl.indexOf('payments') > -1) {
        // If ticket already paid..
        if ( ticketPaid ) {
          // Return response..
          res.json({ message: 'Ticket is already Paid.' });
        }
        else {
          // Check that the request contains something in the body..
          if (Object.keys(req.body).length > 0) {
            // Variables
            let ccNumber = req.body.cc_number,
                cvcNumber = req.body.cc_cvc,
                expiry = req.body.cc_expiry;
            // Process Payment
            let paymentResponse = helpers.process_payment(ccNumber, cvcNumber, expiry, totalOwed);
            // Check response and update capacity...
            if (paymentResponse.processed) {
              // Success...
              // Update capcity count of spots taken.
              Capacity.updateOne( {_id: lotId} ,
                {
                  $inc: { spots_alocated: -1 }
                },
                {new: true},
                function (err, capacity) {
                  if (err){
                     return console.error(err);
                  }
                  else {
                    console.log('Updated Lot Capcity...');
                  }
                }
              );
              // Update Ticket...
              Tickets.updateOne( {_id: ticketId},
                {
                  paid: true,
                  paid_on: Date.now()
                },
                {new: true},
                function (err, capacity) {
                  if (err){
                     return console.error(err);
                  }
                  else {
                    console.log('Updated Ticket...');
                  }
                }
              );
            }
            // Return response object...
            res.json({
              payment_fullfilled: paymentResponse.processed,
              payment_error: paymentResponse.error
            });
          }
          // URL Params missing....
          else {
            console.error('Request Body is missing.');
            res.json({ message: 'Request Body is missing.' });
          }
        }
      }
      // [No Endpoint Match] ---------------------------------------------------
      else {
        console.error('Invalid URL, please review and try again.');
        res.json({ message: 'Invalid URL, please review and try again.' });
      }
    }
  });
};
