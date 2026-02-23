import React from 'react';
import './CustomerSidebar.css';

const CustomerSidebar = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'search', label: 'Find Services', icon: '🔍' },
        { id: 'providers', label: 'All Providers', icon: '👥' },
        { id: 'my-bookings', label: 'My Bookings', icon: '📋' },
        { id: 'favorites', label: 'Favorites', icon: '❤️' },
        { id: 'settings', label: 'Settings', icon: '⚙️' },
    ];

    return (
        <div className="customer-sidebar">
            <div className="sidebar-header">
                <div className="logo">
                    <span className="logo-icon">🔧</span>
                    <span className="logo-text">FixIt</span>
                </div>
                <div className="customer-badge">Customer</div>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(item.id)}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="customer-info">
                    <div className="customer-avatar">👤</div>
                    <div className="customer-details">
                        <p className="customer-name">Customer</p>
                        <p className="customer-status">Online</p>
                    </div>
                </div>
                <button className="logout-btn" onClick={() => {
                    localStorage.clear();
                    window.location.href = '/login';
                }}>
                    🚪 Logout
                </button>
            </div>
        </div>
    );
};

export default CustomerSidebar;