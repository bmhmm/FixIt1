import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Settings.css';

const Settings = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        location: '',
        current_password: '',
        new_password: '',
        confirm_password: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/customer/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const user = response.data.data;
            setFormData(prev => ({
                ...prev,
                full_name: user.full_name,
                email: user.email,
                phone: user.phone || '',
                location: user.location || ''
            }));
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
        setSuccess('');
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5000/api/customer/profile', {
                full_name: formData.full_name,
                phone: formData.phone,
                location: formData.location
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccess('Profile updated successfully');

            // Update stored user info
            const user = JSON.parse(localStorage.getItem('user'));
            user.full_name = formData.full_name;
            localStorage.setItem('user', JSON.stringify(user));

        } catch (error) {
            setError(error.response?.data?.errors?.[0] || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (formData.new_password !== formData.confirm_password) {
            setError('New passwords do not match');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5000/api/customer/password', {
                current_password: formData.current_password,
                new_password: formData.new_password
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccess('Password changed successfully');
            setFormData(prev => ({
                ...prev,
                current_password: '',
                new_password: '',
                confirm_password: ''
            }));

        } catch (error) {
            setError(error.response?.data?.errors?.[0] || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="settings-page">
            <h2>Account Settings</h2>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="settings-grid">
                <div className="settings-card">
                    <h3>Profile Information</h3>
                    <form onSubmit={handleUpdateProfile}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                disabled
                                className="disabled"
                            />
                            <small>Email cannot be changed</small>
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                            />
                        </div>

                        <div className="form-group">
                            <label>Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="City, State"
                            />
                        </div>

                        <button
                            type="submit"
                            className="save-btn"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>

                <div className="settings-card">
                    <h3>Change Password</h3>
                    <form onSubmit={handleChangePassword}>
                        <div className="form-group">
                            <label>Current Password</label>
                            <input
                                type="password"
                                name="current_password"
                                value={formData.current_password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                name="new_password"
                                value={formData.new_password}
                                onChange={handleChange}
                                required
                                minLength="8"
                            />
                        </div>

                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                name="confirm_password"
                                value={formData.confirm_password}
                                onChange={handleChange}
                                required
                                minLength="8"
                            />
                        </div>

                        <button
                            type="submit"
                            className="password-btn"
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>

                <div className="settings-card danger-zone">
                    <h3>Danger Zone</h3>
                    <p>Once you delete your account, there is no going back.</p>
                    <button className="delete-btn">
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;