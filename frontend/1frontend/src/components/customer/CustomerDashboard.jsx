import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CustomerSidebar from '../layout/CustomerSidebar';
import CustomerHeader from '../layout/CustomerHeader';
import SearchServices from './SearchServices';
import ProviderList from './ProviderList';
import ProviderProfileView from './ProviderProfileView';
import BookingForm from './BookingForm';
import MyBookings from './MyBookings';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('search');
    const [customerData, setCustomerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalBookings: 0,
        upcomingBookings: 0,
        completedBookings: 0,
        favoriteProviders: 0
    });

    useEffect(() => {
        // Check if user is logged in and is customer
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');

        if (!user || !token || user.user_type !== 'customer') {
            navigate('/login');
            return;
        }

        setCustomerData(user);

        // Later: Fetch real dashboard stats from API
        // fetchDashboardStats();

        setLoading(false);
    }, []);

    // const fetchDashboardStats = async () => {
    //     try {
    //         const token = localStorage.getItem('token');
    //         const response = await axios.get('http://localhost:5000/api/customer/dashboard', {
    //             headers: { Authorization: `Bearer ${token}` }
    //         });
    //         setStats(response.data.data);
    //     } catch (error) {
    //         console.error('Error fetching stats:', error);
    //     }
    // };

    if (loading) {
        return (
            <div className="customer-loading">
                <div className="loading-spinner"></div>
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="customer-dashboard">
            <CustomerSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="dashboard-main">
                <CustomerHeader customerData={customerData} />

                <div className="dashboard-content">
                    {activeTab === 'search' && <SearchServices />}
                    {activeTab === 'providers' && <ProviderList />}
                    {activeTab === 'profile-view' && <ProviderProfileView />}
                    {activeTab === 'book' && <BookingForm />}
                    {activeTab === 'my-bookings' && <MyBookings />}

                    {activeTab === 'overview' && (
                        <div className="overview-grid">
                            <div className="welcome-section">
                                <h2>Welcome back, {customerData?.full_name?.split(' ')[0]}! 👋</h2>
                                <p>Find trusted professionals for any job</p>
                            </div>

                            <div className="stats-cards">
                                <div className="stat-card">
                                    <div className="stat-icon">📋</div>
                                    <div className="stat-info">
                                        <h3>Total Bookings</h3>
                                        <p className="stat-number">{stats.totalBookings}</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">⏳</div>
                                    <div className="stat-info">
                                        <h3>Upcoming</h3>
                                        <p className="stat-number">{stats.upcomingBookings}</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">✅</div>
                                    <div className="stat-info">
                                        <h3>Completed</h3>
                                        <p className="stat-number">{stats.completedBookings}</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">❤️</div>
                                    <div className="stat-info">
                                        <h3>Favorites</h3>
                                        <p className="stat-number">{stats.favoriteProviders}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="quick-actions">
                                <h3>Quick Actions</h3>
                                <div className="action-buttons">
                                    <button className="action-btn" onClick={() => setActiveTab('search')}>
                                        <span>🔍</span> Find a Service
                                    </button>
                                    <button className="action-btn" onClick={() => setActiveTab('my-bookings')}>
                                        <span>📅</span> My Bookings
                                    </button>
                                    <button className="action-btn">
                                        <span>❤️</span> Favorites
                                    </button>
                                    <button className="action-btn">
                                        <span>⚙️</span> Settings
                                    </button>
                                </div>
                            </div>

                            <div className="recent-providers">
                                <h3>Recommended for You</h3>
                                <p className="empty-message">No recommendations yet. Start searching!</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;