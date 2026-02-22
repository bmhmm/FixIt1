import React from 'react';
import './ProviderSidebar.css';

const ProviderSidebar = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'requests', label: 'Booking Requests', icon: '📋' },
        { id: 'jobs', label: "Today's Jobs", icon: '📅' },
        { id: 'earnings', label: 'Earnings', icon: '💰' },
        { id: 'profile', label: 'My Profile', icon: '👤' },
        { id: 'portfolio', label: 'Portfolio', icon: '🖼️' },
        { id: 'settings', label: 'Settings', icon: '⚙️' },
    ];

    return (
        <div className="provider-sidebar">
            <div className="sidebar-header">
                <div className="logo">
                    <span className="logo-icon">🔧</span>
                    <span className="logo-text">FixIt</span>
                </div>
                <div className="provider-badge">Provider</div>
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
                        {item.id === 'requests' && (
                            <span className="nav-badge">5</span>
                        )}
                    </button>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="provider-info">
                    <div className="provider-avatar">👨‍🔧</div>
                    <div className="provider-details">
                        <p className="provider-name">John Doe</p>
                        <p className="provider-status">Online</p>
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

export default ProviderSidebar;