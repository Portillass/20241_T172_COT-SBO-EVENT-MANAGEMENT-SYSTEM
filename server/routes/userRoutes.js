const express = require('express');
const {
  getAllFeedbackRecords,
  getFeedbackById,
  createFeedback,
  updateFeedback,
  deleteFeedback,
} = require('../controllers/feedbackController');

const router = express.Router();

// Define the routes
router.get('/', getAllFeedbackRecords); 
router.get('/:id', getFeedbackById); 
router.post('/', createFeedback); 
router.put('/:id', updateFeedback); 
router.delete('/:id', deleteFeedback); 

module.exports = router;
