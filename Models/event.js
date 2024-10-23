const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: String,
  date: Date,

});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;