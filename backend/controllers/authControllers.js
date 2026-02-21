const User = require('./../models/user');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array().map(err => err.msg)
            });
        }

        const { full_name, email, password, confirmPassword, role } = req.body;

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                errors: ['Passwords do not match']
            });
        }

        // Validate password strength
        const passwordValidation = User.validatePassword(password);
        if (!passwordValidation.isValid) {
            return res.status(400).json({
                success: false,
                errors: passwordValidation.errors
            });
        }

        // Check if user already exists
        const userExists = await User.emailExists(email);
        if (userExists) {
            return res.status(400).json({
                success: false,
                errors: ['Email already registered']
            });
        }

        // Create user
        const userId = await User.create({
            full_name,
            email,
            password,
            user_type: role // Default to customer
        });

        // Get created user details
        const user = await User.findById(userId);

        // Generate token
        const token = generateToken(userId);

        res.status(201).json({
            success: true,
            message: 'Registration successful! Please login.',
            data: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                user_type: user.user_type,
                token
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            errors: ['Server error during registration']
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array().map(err => err.msg)
            });
        }

        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                errors: ['Invalid email or password']
            });
        }

        // Verify password
        const isPasswordValid = await User.verifyPassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                errors: ['Invalid email or password']
            });
        }

        // Check if user is active
        if (!user.is_active) {
            return res.status(403).json({
                success: false,
                errors: ['Your account has been deactivated. Please contact support.']
            });
        }

        // Generate token
        const token = generateToken(user.id);

        res.json({
            success: true,
            message: 'Login successful!',
            data: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                user_type: user.user_type,
                is_verified: user.is_verified,
                token
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            errors: ['Server error during login']
        });
    }
};

module.exports = {
    register,
    login
};