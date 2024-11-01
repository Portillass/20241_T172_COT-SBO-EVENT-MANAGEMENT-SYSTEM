const express = require('express');
const FeedbackModel = require('../models/feedbackModel'); // Ensure you use the correct model reference

const router = express.Router();

// POST route to submit feedback
router.post('/', async (req, res) => {
  const { user_id, event_id, comments, rating } = req.body;

  if (!user_id || !event_id || !comments || rating === undefined) { // Check if rating is provided
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newFeedback = new FeedbackModel({ user_id, event_id, comments, rating });
    await newFeedback.save();
    res.status(201).json(newFeedback);
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Error submitting feedback', error });
  }
});

// GET route to fetch feedback for a specific event
router.get('/:event_id', async (req, res) => {
  const { event_id } = req.params;

  try {
    const feedbackRecords = await FeedbackModel.find({ event_id });
    res.json(feedbackRecords);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Error fetching feedback', error });
  }
});

// GET route to fetch all feedback records (optional, if needed)
router.get('/', async (req, res) => {
  try {
    const feedbackRecords = await FeedbackModel.find(); // Fetch all feedback records
    res.json(feedbackRecords);
  } catch (error) {
    console.error('Error fetching all feedback:', error);
    res.status(500).json({ message: 'Error fetching all feedback', error });
  }
});

module.exports = router;
