import React from 'react';
import './AdminSidebar.css';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'users', label: 'User Management', icon: '👥' },
        { id: 'verifications', label: 'Provider Verifications', icon: '✅' },
        { id: 'bookings', label: 'All Bookings', icon: '📋' },
        { id: 'reports', label: 'Reports', icon: '📈' },
        { id: 'settings', label: 'Settings', icon: '⚙️' }
    ];

    return (
        <div className="admin-sidebar">
            <div className="sidebar-header">
                <div className="logo">
                    <span className="logo-icon">🔧</span>
                    <span className="logo-text">FixIt</span>
                </div>
                <div className="admin-badge">Admin</div>
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
                        {item.id === 'verifications' && (
                            <span className="nav-badge">3</span>
                        )}
                    </button>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="admin-info">
                    <div className="admin-avatar">👑</div>
                    <div className="admin-details">
                        <p className="admin-name">Admin</p>
                        <p className="admin-status">Online</p>
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

export default AdminSidebar;