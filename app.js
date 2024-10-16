const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Import db (subjects)
const subjects = require('./db'); 
// Root endpoint
app.get('/', (req, res) => {
  res.send('SUBJECTS MANAGEMENT SYSTEM');
});

// Add a new subject
app.post('/subject', (req, res) => {
  const newSubject = req.body;
  subjects.push(newSubject);
  res.status(201).send({ "status": "Success", "newData": subjects });
});

// Get all subjects
app.get('/subject/all', (req, res) => {
  res.status(200).json(subjects);
});

// Get subject by ID
app.get('/subject/i/:id', (req, res) => {
  const id = req.params.id;
  const subject = subjects.find((subj) => subj.subject_id == id);
  if (subject) {
    res.status(200).json(subject);
  } else {
    res.status(404).json({ "status": "Error", "message": "Subject not found" });
  }
});

// Get subject by name
app.get('/subject/n/:name', (req, res) => {
  const name = req.params.name;
  const subject = subjects.find((subj) => subj.subject_name == name);
  if (subject) {
    res.status(200).json(subject);
  } else {
    res.status(404).json({ "status": "Error", "message": "Subject not found" });
  }
});

// Delete a subject by ID
app.delete('/subject/:id', (req, res) => {
  const id = req.params.id;
  const index = subjects.findIndex((subj) => subj.subject_id == id);
  if (index !== -1) {
    subjects.splice(index, 1);
    res.status(200).json({ "status": "Success", "newData": subjects });
  } else {
    res.status(404).json({ "status": "Error", "message": "Subject not found" });
  }
});

// Update a subject by ID
app.patch('/subject/:id', (req, res) => {
  const id = req.params.id;
  const index = subjects.findIndex((subj) => subj.subject_id == id);

  //condition of statement 
  if (index !== -1) {
    subjects[index] = { ...subjects[index], ...req.body }; // Merging updates
    res.status(200).json({ "status": "Success", "newData": subjects });// if success!
  } else {
    res.status(404).json({ "status": "Error", "message": "Subject not found" });//if Error!
  }
});

// Start the server
app.listen(4000, () => {
  console.log('Server is running on port 3000');

//or
/*
app .listen(3000)
*/

});

