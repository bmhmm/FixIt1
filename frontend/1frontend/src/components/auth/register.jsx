import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiErrors, setApiErrors] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Typewriter effect
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [typingSpeed, setTypingSpeed] = useState(150);

    const descriptions = [
        "FixIt connects you with trusted local professionals for plumbing, electrical work, cleaning, tutoring, and more. Book verified experts, track your service in real time, and pay securely — all in one place.",
        "🔧 Find skilled plumbers near you - verified and rated by real customers",
        "⚡ Emergency electrical services available 24/7 with real-time tracking",
        "🧹 Professional cleaning services at your doorstep - book in seconds",
        "📚 Expert tutors for all subjects - online or in-person sessions"
    ];

    useEffect(() => {
        const handleTypewriter = () => {
            const i = loopNum % descriptions.length;
            const fullText = descriptions[i];

            if (!isDeleting && displayText.length < fullText.length) {
                setDisplayText(fullText.substring(0, displayText.length + 1));
                setTypingSpeed(150);
            } else if (isDeleting && displayText.length > 0) {
                setDisplayText(fullText.substring(0, displayText.length - 1));
                setTypingSpeed(50);
            } else if (!isDeleting && displayText.length === fullText.length) {
                setTypingSpeed(2000); // Pause at the end
                setIsDeleting(true);
            } else if (isDeleting && displayText.length === 0) {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
                setTypingSpeed(150);
            }
        };

        const timer = setTimeout(handleTypewriter, typingSpeed);
        return () => clearTimeout(timer);
    }, [displayText, isDeleting, loopNum, typingSpeed, descriptions]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear field error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // Clear API errors when user makes changes
        if (apiErrors.length > 0) {
            setApiErrors([]);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Full name validation
        if (!formData.full_name.trim()) {
            newErrors.full_name = 'Full name is required';
        } else if (formData.full_name.trim().length < 2) {
            newErrors.full_name = 'Full name must be at least 2 characters';
        } else if (!/^[a-zA-Z\s]+$/.test(formData.full_name)) {
            newErrors.full_name = 'Full name can only contain letters and spaces';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else {
            const hasUpperCase = /[A-Z]/.test(formData.password);
            const hasLowerCase = /[a-z]/.test(formData.password);
            const hasNumbers = /\d/.test(formData.password);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);

            if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
                newErrors.password = 'Password must contain uppercase, lowercase, number and special character';
            }
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        setApiErrors([]);

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', formData);

            if (response.data.success) {
                // Store token in localStorage
                localStorage.setItem('token', response.data.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data));

                // Show success message
                alert('Registration successful! Redirecting to dashboard...');

                // Redirect to dashboard or home
                navigate('/dashboard');
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setApiErrors(error.response.data.errors || ['Registration failed. Please try again.']);
            } else {
                setApiErrors(['Network error. Please check your connection.']);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const getPasswordStrength = () => {
        const password = formData.password;
        if (!password) return { strength: 0, label: '' };

        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

        const strengthMap = {
            1: { label: 'Weak', class: 'weak' },
            2: { label: 'Fair', class: 'fair' },
            3: { label: 'Good', class: 'good' },
            4: { label: 'Strong', class: 'strong' },
            5: { label: 'Very Strong', class: 'very-strong' }
        };

        return {
            strength: (strength / 5) * 100,
            ...strengthMap[strength] || { label: '', class: '' }
        };
    };

    const passwordStrength = getPasswordStrength();

    return (
        <div className="register-container">
            <div className="register-wrapper">
                {/* Left side - Branding */}
                <div className="brand-section">
                    <div className="brand-content">
                        <h1 className="brand-title">
                            <span className="brand-icon">🔧</span> FixIt
                        </h1>
                        <div className="typewriter-container">
                            <p className="typewriter-text">{displayText}</p>
                            <span className="typewriter-cursor">|</span>
                        </div>
                        <div className="feature-list">
                            <div className="feature-item">
                                <span className="feature-icon">✓</span>
                                <span>Verified Professionals</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">✓</span>
                                <span>Real-time Tracking</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">✓</span>
                                <span>Secure Payments</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">✓</span>
                                <span>24/7 Support</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side - Registration Form */}
                <div className="form-section">
                    <div className="form-wrapper">
                        <h2 className="form-title">Create Account</h2>
                        <p className="form-subtitle">Join FixIt today and get things done</p>

                        {apiErrors.length > 0 && (
                            <div className="error-alert">
                                {apiErrors.map((error, index) => (
                                    <div key={index}>{error}</div>
                                ))}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="register-form">
                            <div className="form-group">
                                <label htmlFor="full_name">
                                    <span className="label-icon">👤</span>
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="full_name"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    className={errors.full_name ? 'error' : ''}
                                    disabled={isLoading}
                                />
                                {errors.full_name && (
                                    <span className="error-message">{errors.full_name}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">
                                    <span className="label-icon">📧</span>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    className={errors.email ? 'error' : ''}
                                    disabled={isLoading}
                                />
                                {errors.email && (
                                    <span className="error-message">{errors.email}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">
                                    <span className="label-icon">🔒</span>
                                    Password
                                </label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Create a password"
                                        className={errors.password ? 'error' : ''}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                </div>
                                {formData.password && (
                                    <div className="password-strength">
                                        <div className="strength-bar">
                                            <div
                                                className={`strength-fill ${passwordStrength.class}`}
                                                style={{ width: `${passwordStrength.strength}%` }}
                                            ></div>
                                        </div>
                                        <span className={`strength-label ${passwordStrength.class}`}>
                                            {passwordStrength.label}
                                        </span>
                                    </div>
                                )}
                                {errors.password && (
                                    <span className="error-message">{errors.password}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">
                                    <span className="label-icon">🔐</span>
                                    Confirm Password
                                </label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm your password"
                                        className={errors.confirmPassword ? 'error' : ''}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <span className="error-message">{errors.confirmPassword}</span>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Creating Account...
                                    </>
                                ) : (
                                    'Create Account'
                                )}
                            </button>

                            <div className="form-footer">
                                <p>
                                    Already have an account?{' '}
                                    <Link to="/login" className="login-link">
                                        Sign In
                                    </Link>
                                </p>
                            </div>

                            <div className="terms">
                                <p>
                                    By signing up, you agree to our{' '}
                                    <a href="/terms" target="_blank">Terms of Service</a>{' '}
                                    and{' '}
                                    <a href="/privacy" target="_blank">Privacy Policy</a>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;