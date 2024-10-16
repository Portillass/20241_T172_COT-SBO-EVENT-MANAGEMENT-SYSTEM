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

// Add a new adviser
app.post();

// Get all advisers
app.get();

// Get adviser by ID
app.get();

// Get adviser by name
app.get();

// Delete an adviser by ID
app.delete();

// Update an adviser by ID
app.patch();

//========================SBO OFFICER =====================//

// Add a new SBO officer
app.post();

// Get all SBO officers
app.get();

// Get SBO officer by ID
app.get();

// Get SBO officer by name
app.get();

// Delete an SBO officer by ID
app.delete();

// Update an SBO officer by ID
app.patch();

//======================== STUDENT=======================//

// Add a new event (For Advisers or Officers only)
app.post();

// Get all events (Students can view)
app.get();

// Get event by ID (Students can view)
app.get();

// Get event by name (Students can view)
app.get();

app.listen(3000);
