const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login } = require('../controllers/authControllers');

// Validation rules
const registerValidation = [
    body('full_name')
        .trim()
        .notEmpty().withMessage('Full name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z\s]+$/).withMessage('Full name can only contain letters and spaces'),
    
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    
    body('confirmPassword')
        .notEmpty().withMessage('Please confirm your password'),
    body('role').isIn(['customer', 'provider']).withMessage('Role must be customer or provider')
];

const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    
    body('password')
        .notEmpty().withMessage('Password is required')
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// ✅ Make sure to export the router
module.exports = router;