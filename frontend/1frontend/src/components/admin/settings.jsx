import React, { useState } from 'react';
import './Settings.css';

const Settings = () => {
    const [activeSection, setActiveSection] = useState('general');

    return (
        <div className="admin-settings">
            <h2>Platform Settings</h2>

            <div className="settings-layout">
                <div className="settings-sidebar">
                    <button
                        className={activeSection === 'general' ? 'active' : ''}
                        onClick={() => setActiveSection('general')}
                    >
                        ⚙️ General Settings
                    </button>
                    <button
                        className={activeSection === 'payment' ? 'active' : ''}
                        onClick={() => setActiveSection('payment')}
                    >
                        💳 Payment Settings
                    </button>
                    <button
                        className={activeSection === 'commission' ? 'active' : ''}
                        onClick={() => setActiveSection('commission')}
                    >
                        📊 Commission Rates
                    </button>
                    <button
                        className={activeSection === 'email' ? 'active' : ''}
                        onClick={() => setActiveSection('email')}
                    >
                        📧 Email Templates
                    </button>
                    <button
                        className={activeSection === 'security' ? 'active' : ''}
                        onClick={() => setActiveSection('security')}
                    >
                        🔒 Security
                    </button>
                </div>

                <div className="settings-content">
                    {activeSection === 'general' && (
                        <div className="settings-form">
                            <h3>General Settings</h3>

                            <div className="form-group">
                                <label>Platform Name</label>
                                <input type="text" value="FixIt" readOnly disabled />
                            </div>

                            <div className="form-group">
                                <label>Contact Email</label>
                                <input type="email" placeholder="admin@fixit.com" />
                            </div>

                            <div className="form-group">
                                <label>Support Phone</label>
                                <input type="text" placeholder="+1 234 567 890" />
                            </div>

                            <div className="form-group">
                                <label>Currency</label>
                                <select>
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="GBP">GBP (£)</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Timezone</label>
                                <select>
                                    <option value="UTC">UTC</option>
                                    <option value="EST">Eastern Time</option>
                                    <option value="PST">Pacific Time</option>
                                </select>
                            </div>

                            <button className="save-settings">Save Changes</button>
                        </div>
                    )}

                    {activeSection === 'commission' && (
                        <div className="settings-form">
                            <h3>Commission Rates</h3>

                            <div className="form-group">
                                <label>Platform Commission (%)</label>
                                <input type="number" min="0" max="100" placeholder="15" />
                                <small>Percentage taken from each booking</small>
                            </div>

                            <div className="form-group">
                                <label>New Provider Discount (%)</label>
                                <input type="number" min="0" max="100" placeholder="5" />
                                <small>Reduced commission for first 3 months</small>
                            </div>

                            <div className="form-group">
                                <label>Minimum Payout Amount ($)</label>
                                <input type="number" placeholder="50" />
                            </div>

                            <button className="save-settings">Update Commission</button>
                        </div>
                    )}

                    {activeSection === 'payment' && (
                        <div className="settings-form">
                            <h3>Payment Settings</h3>

                            <div className="payment-methods">
                                <label className="checkbox-label">
                                    <input type="checkbox" checked /> Credit/Debit Cards
                                </label>
                                <label className="checkbox-label">
                                    <input type="checkbox" checked /> PayPal
                                </label>
                                <label className="checkbox-label">
                                    <input type="checkbox" /> Stripe
                                </label>
                                <label className="checkbox-label">
                                    <input type="checkbox" /> Bank Transfer
                                </label>
                            </div>

                            <div className="form-group">
                                <label>Stripe API Key</label>
                                <input type="password" placeholder="sk_live_..." />
                            </div>

                            <div className="form-group">
                                <label>PayPal Client ID</label>
                                <input type="text" placeholder="your_paypal_client_id" />
                            </div>

                            <button className="save-settings">Save Payment Settings</button>
                        </div>
                    )}

                    {activeSection === 'security' && (
                        <div className="settings-form">
                            <h3>Security Settings</h3>

                            <div className="form-group">
                                <label>Admin Email</label>
                                <input type="email" value="admin@fixit.com" />
                            </div>

                            <div className="form-group">
                                <label>Current Password</label>
                                <input type="password" placeholder="Enter current password" />
                            </div>

                            <div className="form-group">
                                <label>New Password</label>
                                <input type="password" placeholder="Enter new password" />
                            </div>

                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input type="password" placeholder="Confirm new password" />
                            </div>

                            <button className="save-settings">Update Password</button>

                            <div className="danger-zone">
                                <h4>Danger Zone</h4>
                                <p>These actions cannot be undone</p>
                                <button className="danger-btn">Disable Platform</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;