'use strict';

exports.calculate_rate = function(rate, created, requested) {
  // [Calculate Rate Function] ----------------------------------------
  // Takes in 3 arguments in order to calculate the amount owed by the client.
  //
  // rate: Comes directly from the ticket and represents the dollars / hour cost.
  // created: Receives date from database in Timestamp so must be converted to millis.
  // requested: Comes in as standard millis ready to calculate.
  var total = null;

  // Get the difference in time in minutes
  let delta = Math.ceil( (requested - created) / 60000);
  let rateMinute = rate / 60;

  // [ Rate Calculations ] -----------------------------
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

exports.process_payment = function(ccNumber, cvcNumber, expiry, total) {
  // [Process Payment ] --------------------------------------------
  // This is a mock function of a CC processing step. There will be no real
  // credit card processing going on but it should resemble the functionality
  //
  // This function takes 3 arguments:
  // ccNumber: Credit Card number for validation & processing
  // cvcNumber: Credit Card Security Number
  // expiry: Credit Card expiry Date
  // total: Total dollars to be charged on card
  //--------------------------------------------------------------------

  // Validate Credit Card number...
  // Only doing the 3 major ones for now...
  let validCard = false;
  // Card validation models.
  let cardModels = [
    {
      cardType: 'Amex',
      cardRegex: /^(?:3[47][0-9]{13})$/
    },
    {
      cardType: 'Visa',
      cardRegex: /^(?:4[0-9]{12}(?:[0-9]{3})?)$/
    },
    {
      cardType: 'MasterCard',
      cardRegex: /^(?:5[1-5][0-9]{14})$/
    },
  ]
  // CVC validation
  let cvcModel = /^[0-9]{3,4}$/,
      cvcRegEx = new RegExp(cvcModel);
  // Date model works for a few different date formats, requires processing to normalize
  let dateModel = /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/,
      dateRegEx = new RegExp(dateModel);

  // Loop through models and compare
  for (let i=0; i <= cardModels.length -1; i++) {
    let regEx = new RegExp(cardModels[i].cardRegex)

    if (regEx.test(ccNumber)) {
      // Flip flag to true
      validCard = true;
      console.error('Card Matches' + cardModels[i].cardType);
    }
    else {
      // Leave flag as false...
      console.error('Card did not match' + cardModels[i].cardType);
    }
  }
  // If valid... Call Payment processor and make exchange
  if ( validCard && cvcRegEx.test(cvcNumber) && dateRegEx.test(expiry) ) {
    // Other arguments would be passed in with this function
    // were it a real payment processor.
    return processPayment(ccNumber, cvcNumber, expiry, total);
  }
  else {
    // If card is invalid, return an error.
    console.error('Invalid Card.');
    return {
      processed: false,
      error: 'Invalid Card, could not process.'
    };
  }
  // [Process Payment] ---------------------------------------------------------
  // In this step we would usually communicate with a payment provider
  // exchange tokens and CC information via encrypted connection
  // For the purposes of this test lets pretend that is what is happening here....
  function processPayment(ccNumber, cvcNumber, expiry, total) {
    // TESTING FLAG , you can set to FALSE to get an error as if the payment processor failed.
    let processorResponse = true;
    // We would take the payload here and make some sort of object..
    // Keys here are made up.. would be based on payment processor docs..
    let reqBody = {
      creditNumber: ccNumber,
      securityNumber: cvcNumber,
      expiryDate: expiry,
      totalCharge: total
    }
    // We would then make some sort of request to the server.. send this stuff Over
    // and wait for a response..
    if ( processorResponse ) {
      return {
        processed: true,
        error: false
      }
    }
    else {
      return {
        processed: false,
        error: 'Could not process request.'
      }
    }
  }
}
