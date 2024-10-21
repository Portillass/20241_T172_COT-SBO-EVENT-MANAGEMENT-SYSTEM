const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Root endpoint
app.get('/', (req, res) => {
  res.send('COT-SBO EVENT MANAGEMENT SYSTEM');
});

//===============ADVISER===============//

// Add a new SBO Officer
app.post();
// View Event
app.get();

// Downlaod all attendance
app.get();

// Edit  event 
app.patch();

// Approved event 
app.patch();

// Disapproved event 
app.patch();

// Delete SBO Officer
app.delete();

// Delete an event
app.delete();

//========================SBO OFFICER =====================//

// Add a new event
app.post();

// Get all events (SBO Officer can view and manage)
app.get();

// Get event by ID (SBO Officer can view and manage)
app.get();

// Get event by name (SBO Officer can view and manage)
app.get();

// Delete an event (SBO Officer only)
app.delete();

// Update an event (SBO Officer only)
app.patch();




// thisis the mobile phone that only they can scan qr code 
//======================== STUDENT=======================//

// can Scan Qr code 
app.get();

// Get all events
app.get();

// Get event by time and date
app.get();


// 
app.listen(3000);
