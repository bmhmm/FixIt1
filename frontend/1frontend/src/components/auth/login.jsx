import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '', // Changed from 'login' to 'email'
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiErrors, setApiErrors] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

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
                setTypingSpeed(2000);
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

    // Check for saved email
    useEffect(() => {
        const savedEmail = localStorage.getItem('rememberedEmail');
        if (savedEmail) {
            setFormData(prev => ({ ...prev, email: savedEmail }));
            setRememberMe(true);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        if (apiErrors.length > 0) {
            setApiErrors([]);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        setApiErrors([]);

        try {
            // Send email only (no phone)
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email: formData.email,  // Send as 'email' not 'login'
                password: formData.password
            });

            if (response.data.success) {
                // Handle remember me
                if (rememberMe) {
                    localStorage.setItem('rememberedEmail', formData.email);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }

                // Store token and user data
                localStorage.setItem('token', response.data.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data));

                // Backend auto-detects role from database - redirect based on user_type
                const userType = response.data.data.user_type;

                switch (userType) {
                    case 'admin':
                        navigate('/api/admin/dashboard');
                        break;
                    case 'provider':
                        navigate('/api/provider/dashboard');
                        break;
                    case 'customer':
                    default:
                        navigate('/api/customer/dashboard');
                        break;
                }
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setApiErrors(error.response.data.errors || ['Login failed. Please try again.']);
            } else {
                setApiErrors(['Network error. Please check your connection.']);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-wrapper">
                {/* Left side - Branding with softer gradient */}
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

                {/* Right side - Login Form */}
                <div className="form-section">
                    <div className="form-wrapper">
                        <h2 className="form-title">Welcome Back! 👋</h2>
                        <p className="form-subtitle">Sign in to continue to FixIt</p>

                        {apiErrors.length > 0 && (
                            <div className="error-alert">
                                {apiErrors.map((error, index) => (
                                    <div key={index}>{error}</div>
                                ))}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="login-form">
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
                                        placeholder="Enter your password"
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
                                {errors.password && (
                                    <span className="error-message">{errors.password}</span>
                                )}
                            </div>

                            <div className="form-options">
                                <label className="remember-me">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <span>Remember me</span>
                                </label>
                                <Link to="/forgot-password" className="forgot-password">
                                    Forgot Password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </button>

                            <div className="form-footer">
                                <p>
                                    Don't have an account?{' '}
                                    <Link to="/register" className="register-link">
                                        Create Account
                                    </Link>
                                </p>
                            </div>

                            <div className="terms">
                                <p>
                                    By signing in, you agree to our{' '}
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

export default Login;