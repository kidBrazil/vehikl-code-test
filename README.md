# [ Vehikl Code Test ] - Parking Lot Mock API.
This repository contains the code test produced for Vehikl as part of their interview process. The objective of the test was to create a mock application consisting of a Backend API and a client to consume it. The purpose of the application is to serve as a parking lot manager app issuing tickets, managing lot capacity and processing payments.

As this is a test, much of the functionality is basic and offered up as a mock of what the real thing would be. For instance, the credit card validation steps would be more robust and all communication would have to be encrypted.

## Running project locally
Running the project locally requires Node.js and NPM installed. Once you have those installed you should be able to clone this repository and run the following commands.

```bash
# Inside of /vehikl-code-test/api run...

# Install dependencies
npm install
# Run Express server (://localhost:3000)
npm run start

# On a new terminal, go to /vehikl-code-test/api
# Login to NPM
npm login

# Install Dependencies
npm install

# Run local instance of Vue Client (://localhost:8080)
npm run dev
```

## Deploying project online
TODO

----

## [ API Data Models ]
This mock API contains two simple data models for MongoDB. The first model covers the parking lot information and the second model covers the Ticket information that must be stored.

### Lot Capacity Model
```js
// lotCapacityModel.js
var LotCapcity = new Schema({
  lot_capacity: Number,
  spots_alocated: Number,
  base_rate: Number
});
```

### Ticket Model
```js
// ticketModel.js
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
  lot_id: {
    type: String
  },
  ticket_rate: {
    type: Number,
    default: 3
  }
});
```

---

## [ API Endpoints Documentation ]
For detailed API Endpoint documentation please see [Apiary Docs](https://app.apiary.io/vehikltest/) for detailed information. If you require access to
this Apiary instance, please email hello@lucasmoreira.dev with your email and GitHub Username.

### [ GET /tickets ]
This endpoint will provision a new parking ticket if capacity is available on the lot. It will return a ticket number that can be used to retrieve and pay later.

### [ POST /tickets/:ticketNumber ]
This endpoint will return the total amount owed on a given ticket. If the ticket has already been paid it will return a 0.

### [ POST /payments/:ticketNumber ]
This endpoint will carry out payment processing on the total owed. It will update lot capacity to reflect a car being removed and will update the ticket to mark it as paid.

---

## [ Helper Functions ]
The application includes two helper functions to achieve the desired functionality. One function serves the purpose of calculating the rates for the length of stay and the other is responsible for payment processing.

```js
// Check Rate ------------------------------------------------
// Takes in 3 arguments in order to calculate the amount owed by the client.
//
// rate: Comes directly from the ticket and represents the dollars / hour cost.
// created: Receives date from database in Timestamp so must be converted to millis.
// requested: Comes in as standard millis ready to calculate.
helpers.calculate_rate( ticketRate, createdTime, requestTime );

// Process Payments-------------------------------------------
// This is a mock function of a CC processing step. There will be no real
// credit card processing going on but it should resemble the functionality
//
// This function takes 3 arguments:
// ccNumber: Credit Card number for validation & processing
// cvcNumber: Credit Card Security Number
// expiry: Credit Card expiry Date
// total: Total dollars to be charged on card
helpers.process_payment(ccNumber, cvcNumber, expiry, totalOwed);
```
