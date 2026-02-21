const jwt = require('jsonwebtoken');
const User = require('./../models/user');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token (excluding password)
            const user = await User.findById(decoded.id);
            
            if (!user) {
                return res.status(401).json({
                    success: false,
                    errors: ['User not found']
                });
            }

            // Check if user is active
            if (!user.is_active) {
                return res.status(403).json({
                    success: false,
                    errors: ['Account deactivated. Please contact support.']
                });
            }

            // Attach user to request object
            req.user = user;
            next();

        } catch (error) {
            console.error('Auth middleware error:', error);
            return res.status(401).json({
                success: false,
                errors: ['Not authorized, token failed']
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            errors: ['Not authorized, no token']
        });
    }
};

// Check if user is provider
const provider = (req, res, next) => {
    if (req.user && req.user.user_type === 'provider') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            errors: ['Access denied. Provider only.']
        });
    }
};

// Check if user is admin or provider
const adminOrProvider = (req, res, next) => {
    if (req.user && (req.user.user_type === 'provider' || req.user.user_type === 'admin')) {
        next();
    } else {
        return res.status(403).json({
            success: false,
            errors: ['Access denied. Admin or Provider only.']
        });
    }
};

// Optional auth - doesn't require token but attaches user if token exists
const optionalAuth = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);
            
            if (user && user.is_active) {
                req.user = user;
            }
        } catch (error) {
            // Ignore token errors for optional auth
        }
    }
    next();
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                errors: ['Unauthorized']
            });
        }
        
        if (!roles.includes(req.user.user_type)) {
            return res.status(403).json({
                success: false,
                errors: ['Access denied. Insufficient permissions.']
            });
        }
        
        next();
    };
};

module.exports = {
    protect,
    provider,
    adminOrProvider,
    optionalAuth,
    authorize  // Add this line!
};