import React from 'react';
import './ProviderHeader.css';

const ProviderHeader = ({ providerData }) => {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <header className="provider-header">
            <div className="header-left">
                <h2>{getGreeting()}, {providerData?.full_name || 'Provider'}! 👋</h2>
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
                <div className="header-search">
                    <span className="search-icon" style={{ marginRight: "10px" }}>🔍</span>
                    <input type="text" placeholder="Search bookings..." style={{ marginLeft: "20px" }} />
                </div>

                <div className="header-notifications">
                    <button className="notification-btn">
                        <span className="notification-icon">🔔</span>
                        <span className="notification-badge">3</span>
                    </button>
                </div>

                <div className="header-profile">
                    <div className="header-avatar">
                        👨‍🔧
                    </div>
                </div>
            </div>
        </header>
    );
};

export default ProviderHeader;