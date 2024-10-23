const mongoose = require('mongoose');

const sboOfficerSchema = new mongoose.Schema({
  name: String,

  
});

const SBOOfficer = mongoose.model('SBOOfficer', sboOfficerSchema);

module.exports = SBOOfficer;