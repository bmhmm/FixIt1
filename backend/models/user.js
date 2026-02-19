const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    // Create new user
    static async create(userData) {
        const { full_name, email, password, user_type = 'customer' } = userData;
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const query = 'INSERT INTO users (full_name, email, password, user_type) VALUES (?, ?, ?, ?)';
        const [result] = await pool.execute(query, [full_name, email, hashedPassword, user_type]);
        
        return result.insertId;
    }

    // Find user by email
    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await pool.execute(query, [email]);
        return rows[0];
    }

    // Find user by ID
    static async findById(id) {
        const query = 'SELECT id, full_name, email, user_type, is_verified, created_at FROM users WHERE id = ?';
        const [rows] = await pool.execute(query, [id]);
        return rows[0];
    }

    // Verify password
    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    // Check if email exists
    static async emailExists(email) {
        const query = 'SELECT id FROM users WHERE email = ?';
        const [rows] = await pool.execute(query, [email]);
        return rows.length > 0;
    }

    // Validate password strength
    static validatePassword(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        const errors = [];
        if (password.length < minLength) errors.push(`Password must be at least ${minLength} characters`);
        if (!hasUpperCase) errors.push('Password must contain at least one uppercase letter');
        if (!hasLowerCase) errors.push('Password must contain at least one lowercase letter');
        if (!hasNumbers) errors.push('Password must contain at least one number');
        if (!hasSpecialChar) errors.push('Password must contain at least one special character');

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

module.exports = User;