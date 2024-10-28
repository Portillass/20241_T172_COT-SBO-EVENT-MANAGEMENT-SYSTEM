const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/add-officer', adminController.addSboOfficer);
router.post('/approve-event', adminController.approveEvent);
router.get('/generate-reports', adminController.generateReports);
router.get('/view-analytics', adminController.viewAnalytics);

module.exports = router;
