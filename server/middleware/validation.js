const { check, validationResult } = require('express-validator');

exports.validateRegistration = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

exports.validateLogin = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

exports.validateEvent = [
  check('summary', 'Event name is required').not().isEmpty(),
  check('startDateTime', 'Start date and time is required')
    .not()
    .isEmpty()
    .custom((value, { req }) => {
      const startDate = new Date(value);
      if (isNaN(startDate.getTime())) {
        throw new Error('Invalid start date format');
      }
      return true;
    }),
  check('endDateTime', 'End date and time is required')
    .not()
    .isEmpty()
    .custom((value, { req }) => {
      const endDate = new Date(value);
      if (isNaN(endDate.getTime())) {
        throw new Error('Invalid end date format');
      }
      if (new Date(value) <= new Date(req.body.startDateTime)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  check('description').optional(),
  check('location').optional(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }
    next();
  }
];