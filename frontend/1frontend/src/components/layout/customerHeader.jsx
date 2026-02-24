import React from 'react';
import './CustomerHeader.css';

const CustomerHeader = ({ customerData }) => {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <header className="customer-header">
            <div className="header-left">
                <h2>{getGreeting()}, {customerData?.full_name?.split(' ')[0] || 'Customer'}! 👋</h2>
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
                        <span className="notification-badge">0</span>
                    </button>
                </div>

                <div className="header-profile">
                    <div className="header-avatar">
                        👤
                    </div>
                </div>
            </div>
        </header>
    );
};

export default CustomerHeader;