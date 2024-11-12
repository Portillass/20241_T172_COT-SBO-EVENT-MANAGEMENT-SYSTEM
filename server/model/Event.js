const mongoose = require("mongoose");

// Define the Event schema
const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },        // Event name
  theme: { type: String, required: true },       // Event theme
  date: { type: Date, required: true },          // Event date
  time: { type: String, required: true },        // Event time
  address: { type: String, required: true },     // Event address
  status: { type: String, enum: ["Approved", "Disapproved", "Pending"], default: "Pending" }, // Event status
  dateSubmitted: { type: Date, default: Date.now }, // Date when event is created
});

// Create the Event model
const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
