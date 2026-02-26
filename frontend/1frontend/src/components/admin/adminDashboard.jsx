import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import UserManagement from './UserManagement';
import ProviderVerification from './ProviderVerification';
import AllBookings from './AllBookings';
import Reports from './Reports';
import Settings from './Settings';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [adminData, setAdminData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProviders: 0,
        totalBookings: 0,
        pendingVerifications: 0,
        revenue: 0
    });

    useEffect(() => {
        // Check if user is logged in and is admin
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');

        if (!user || !token || user.user_type !== 'admin') {
            navigate('/login');
            return;
        }

        setAdminData(user);
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/admin/dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(response.data.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="loading-spinner"></div>
                <p>Loading admin dashboard...</p>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="dashboard-main">
                <AdminHeader adminData={adminData} />

                <div className="dashboard-content">
                    {activeTab === 'overview' && (
                        <div className="overview-grid">
                            <div className="welcome-section">
                                <h2>Welcome back, {adminData?.full_name}! 👑</h2>
                                <p>Here's what's happening with your platform today</p>
                            </div>

                            <div className="stats-grid">
                                <div className="stat-card purple">
                                    <div className="stat-icon">👥</div>
                                    <div className="stat-info">
                                        <h3>Total Users</h3>
                                        <p className="stat-number">{stats.totalUsers}</p>
                                    </div>
                                </div>
                                <div className="stat-card purple">
                                    <div className="stat-icon">👨‍🔧</div>
                                    <div className="stat-info">
                                        <h3>Providers</h3>
                                        <p className="stat-number">{stats.totalProviders}</p>
                                    </div>
                                </div>
                                <div className="stat-card purple">
                                    <div className="stat-icon">📋</div>
                                    <div className="stat-info">
                                        <h3>Total Bookings</h3>
                                        <p className="stat-number">{stats.totalBookings}</p>
                                    </div>
                                </div>
                                <div className="stat-card purple">
                                    <div className="stat-icon">⏳</div>
                                    <div className="stat-info">
                                        <h3>Pending Verifications</h3>
                                        <p className="stat-number">{stats.pendingVerifications}</p>
                                    </div>
                                </div>
                                <div className="stat-card purple">
                                    <div className="stat-icon">💰</div>
                                    <div className="stat-info">
                                        <h3>Revenue</h3>
                                        <p className="stat-number">${stats.revenue}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="quick-actions">
                                <h3>Quick Actions</h3>
                                <div className="action-buttons">
                                    <button className="action-btn" onClick={() => setActiveTab('verifications')}>
                                        <span>✅</span> Verify Providers
                                    </button>
                                    <button className="action-btn" onClick={() => setActiveTab('users')}>
                                        <span>👥</span> Manage Users
                                    </button>
                                    <button className="action-btn" onClick={() => setActiveTab('bookings')}>
                                        <span>📋</span> View All Bookings
                                    </button>
                                    <button className="action-btn" onClick={() => setActiveTab('reports')}>
                                        <span>📊</span> View Reports
                                    </button>
                                </div>
                            </div>

                            <div className="recent-activity">
                                <h3>Recent Activity</h3>
                                <div className="activity-list">
                                    <div className="empty-state">
                                        <p>No recent activity</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && <UserManagement />}
                    {activeTab === 'verifications' && <ProviderVerification />}
                    {activeTab === 'bookings' && <AllBookings />}
                    {activeTab === 'reports' && <Reports />}
                    {activeTab === 'settings' && <Settings />}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;