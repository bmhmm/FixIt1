import React from 'react';
import './AdminHeader.css';

const AdminHeader = ({ adminData }) => {
    return (
        <header className="admin-header">
            <div className="header-left">
                <h2>Admin Panel</h2>
                <p className="date-today">
                    {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </p>
            </div>

            <div className="header-right">
                <div className="header-notifications">
                    <button className="notification-btn">
                        <span className="notification-icon">🔔</span>
                        <span className="notification-badge">3</span>
                    </button>
                </div>

                <div className="header-profile">
                    <div className="header-avatar">👑</div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;