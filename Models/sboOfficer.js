const mongoose = require('mongoose');

const sboOfficerSchema = new mongoose.Schema({
  name: String,
  // ... other SBO Officer properties
});

const SBOOfficer = mongoose.model('SBOOfficer', sboOfficerSchema);

module.exports = SBOOfficer;