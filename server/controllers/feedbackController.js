const FeedbackModel = require('../models/feedbackModel'); // Ensure this matches the model file

// Get all feedback records
exports.getAllFeedbackRecords = async (req, res) => {
  try {
    const feedbackRecords = await FeedbackModel.find();
    res.json(feedbackRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a feedback record by ID
exports.getFeedbackById = async (req, res) => {
  try {
    const feedback = await FeedbackModel.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback record not found" });
    }
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new feedback record
exports.createFeedback = async (req, res) => {
  const feedback = new FeedbackModel(req.body);
  try {
    const newFeedback = await feedback.save();
    res.status(201).json(newFeedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a feedback record by ID
exports.updateFeedback = async (req, res) => {
  try {
    const updatedFeedback = await FeedbackModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Ensures that schema validation is applied on updates
    );
    if (!updatedFeedback) {
      return res.status(404).json({ message: "Feedback record not found" });
    }
    res.json(updatedFeedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a feedback record by ID
exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await FeedbackModel.findByIdAndDelete(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback record not found" });
    }
    res.json({ message: "Feedback record deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
