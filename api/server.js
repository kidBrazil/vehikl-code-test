// Parking Lot API ---------------------------------------
var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;
  mongoose = require('mongoose'),
  Capacity = require('./models/lotCapacityModel'),
  cors = require('cors'),
  Tickets = require('./models/ticketModel'),
  bodyParser = require('body-parser');

// Loading Mongoose
mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', true);
mongoose.connect('mongodb://localhost:27017/ParkingLotSequoia123123312312', { useNewUrlParser: true });
mongoose.set('useUnifiedTopology', true);
// Configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Enable CORS
app.use(cors());

// Load Routes
var routes = require('./routes/parkingRoutes');
routes(app);

// 404 Fallbacks
app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' Could not be found'})
});

// Open Ports
let server = app.listen(port);

// Check for Parking lot Initialization
Capacity.find({}, function(err, capacity) {
  // Error Function
  if (err) {
    console.log('Error: Mongoose could not complete action.');
    console.log(err);
  }

  // Check that Capacity has been initialized (length > 1)
  if (capacity.length === 0) {
    // If capacity not initialize, create it now.
    console.log('Lot Capacity not Initialized, starting now:');
    // Setup Dummy parking lot with 110 Capacity
    var mainLot = new Capacity({
      lot_capacity: 30,
      base_rate: 3.00,
      // Lets pretend there are already some cars parked..
      // If this was a real app spots allocated would be zero
      // and there would be some sort of UI to get the capacity entered
      // by the lot operators.
      spots_alocated: 15
    });

    // Save new lot to DB
    mainLot.save(function (err, lot) {
      if (err) return console.error(err);
      console.log("[ Parking Lot Initialized ]--------------------------");
      console.log("Lot ID: " + lot.id);
    });
  }

  // If Capcity already setup..
  else {
    console.log('[ Capacity is already initialized. ]')
  }
});

// Server Started
console.log('Parking Lot Manager Started: ' + port);
