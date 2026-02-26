import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProviderSidebar from '../layout/providerSidebar';
import ProviderHeader from '../layout/providerHeader';
import BookingRequests from './bookingRequests';
import TodaysJobs from './todaysJobs';
import Earnings from './earnings';
import './ProviderDashboard.css';



const ProviderDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [providerData, setProviderData] = useState(null);
    const [loading, setLoading] = useState(true);


    const [dashboardStats, setDashboardStats] = useState({
        todayJobs: 0,
        pendingRequests: 0,
        monthEarnings: 0,
        rating: '0.0'
    });

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/provider/dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDashboardStats(response.data.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    useEffect(() => {
        // Check if user is logged in and is provider
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');

        if (!user || !token || user.user_type !== 'provider') {
            navigate('/login');
            return;
        }

        setProviderData(user);
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5173/api/provider/dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Handle dashboard data
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="provider-loading">
                <div className="loading-spinner"></div>
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="provider-dashboard">
            <ProviderSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="dashboard-main">
                <ProviderHeader providerData={providerData} />

                <div className="dashboard-content">
                    {activeTab === 'overview' && (
                        <div className="overview-grid">
                            {/* <div className="stats-cards">
                                <div className="stat-card">
                                    <div className="stat-icon">📅</div>
                                    <div className="stat-info">
                                        <h3>Today's Jobs</h3>
                                        <p className="stat-number">3</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">⏳</div>
                                    <div className="stat-info">
                                        <h3>Pending Requests</h3>
                                        <p className="stat-number">5</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">💰</div>
                                    <div className="stat-info">
                                        <h3>This Month</h3>
                                        <p className="stat-number">$1,250</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">⭐</div>
                                    <div className="stat-info">
                                        <h3>Rating</h3>
                                        <p className="stat-number">4.8</p>
                                    </div>
                                </div>
                            </div> */}
                            {/* // Replace the stats cards section with this: */}
                            <div className="stats-cards">
                                <div className="stat-card">
                                    <div className="stat-icon">📅</div>
                                    <div className="stat-info">
                                        <h3>Today's Jobs</h3>
                                        <p className="stat-number">{dashboardStats?.todayJobs || 0}</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">⏳</div>
                                    <div className="stat-info">
                                        <h3>Pending Requests</h3>
                                        <p className="stat-number">{dashboardStats?.pendingRequests || 0}</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">💰</div>
                                    <div className="stat-info">
                                        <h3>This Month</h3>
                                        <p className="stat-number">${dashboardStats?.monthEarnings || 0}</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">⭐</div>
                                    <div className="stat-info">
                                        <h3>Rating</h3>
                                        <p className="stat-number">{dashboardStats?.rating || '0.0'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="quick-actions">
                                <h3>Quick Actions</h3>
                                <div className="action-buttons">
                                    <button className="action-btn">
                                        <span>📋</span> Update Availability
                                    </button>
                                    <button className="action-btn">
                                        <span>💰</span> Set Rates
                                    </button>
                                    <button className="action-btn">
                                        <span>🖼️</span> Add Portfolio
                                    </button>
                                    <button className="action-btn">
                                        <span>✅</span> Verify Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'requests' && <BookingRequests />}
                    {activeTab === 'jobs' && <TodaysJobs />}
                    {activeTab === 'earnings' && <Earnings />}
                    {activeTab === 'profile' && <ProviderProfile />}
                    {activeTab === 'portfolio' && <ProviderPortfolio />}
                    {activeTab === 'settings' && <ProviderSettings />}
                </div>
            </div>
        </div>
    );
};
// Add this at the bottom of ProviderDashboard.jsx, before export
// const ProviderProfile = () => {
//     return (
//         <div className="profile-section">
//             <h2>My Profile</h2>
//             <div className="profile-card">
//                 <div className="profile-header">
//                     <div className="profile-avatar-large">👨‍🔧</div>
//                     <div className="profile-title">
//                         <h3>John Doe</h3>
//                         <p>⚡ Electrician • 8 years experience</p>
//                     </div>
//                     <button className="edit-profile-btn">✏️ Edit</button>
//                 </div>

//                 <div className="profile-details-grid">
//                     <div className="detail-item">
//                         <label>Hourly Rate</label>
//                         <p>$45 - $65</p>
//                     </div>
//                     <div className="detail-item">
//                         <label>Service Area</label>
//                         <p>Downtown, Uptown</p>
//                     </div>
//                     <div className="detail-item">
//                         <label>Response Time</label>
//                         <p className="badge-green">Within 1 hour</p>
//                     </div>
//                     <div className="detail-item">
//                         <label>Verification</label>
//                         <p className="badge-blue">✓ ID Verified</p>
//                     </div>
//                 </div>

//                 <div className="profile-bio">
//                     <label>About Me</label>
//                     <p>Licensed electrician with 8 years of experience in residential and commercial electrical work. Specialized in installations, repairs, and safety inspections.</p>
//                 </div>

//                 <div className="profile-services">
//                     <label>Services Offered</label>
//                     <div className="service-tags">
//                         <span>Electrical Installation</span>
//                         <span>Repairs</span>
//                         <span>Safety Inspection</span>
//                         <span>Lighting</span>
//                         <span>Circuit Breaker</span>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

const ProviderProfile = () => {
    // Later: Fetch real profile data from API
    const profile = {
        full_name: 'Your Name',
        email: 'your@email.com',
        phone: 'Not added',
        location: 'Not set',
        rating: '0.0',
        total_jobs: 0
    };

    return (
        <div className="profile-section">
            <h2>My Profile</h2>
            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-avatar-large">👤</div>
                    <div className="profile-title">
                        <h3>{profile.full_name}</h3>
                        <p>⚡ Provider • 0 years experience</p>
                    </div>
                    <button className="edit-profile-btn">✏️ Edit</button>
                </div>

                <div className="profile-details-grid">
                    <div className="detail-item">
                        <label>Email</label>
                        <p>{profile.email}</p>
                    </div>
                    <div className="detail-item">
                        <label>Phone</label>
                        <p>{profile.phone}</p>
                    </div>
                    <div className="detail-item">
                        <label>Location</label>
                        <p>{profile.location}</p>
                    </div>
                    <div className="detail-item">
                        <label>Rating</label>
                        <p>{profile.rating} ⭐</p>
                    </div>
                </div>

                <div className="profile-bio">
                    <label>About Me</label>
                    <p>No bio added yet. Tell customers about yourself!</p>
                </div>

                <div className="profile-services">
                    <label>Services Offered</label>
                    <div className="service-tags">
                        <span className="empty-tag">No services added</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProviderPortfolio = () => {
    return (
        <div className="portfolio-section">
            <h2>My Portfolio</h2>
            <div className="empty-state">
                <span className="empty-icon">🖼️</span>
                <h3>No portfolio items yet</h3>
                <p>Add photos of your work to showcase your skills</p>
                <button className="add-portfolio-btn">+ Add Photos</button>
            </div>
        </div>
    );
};

const ProviderSettings = () => {
    return (
        <div className="settings-section">
            <h2>Settings</h2>
            <div className="empty-state">
                <span className="empty-icon">⚙️</span>
                <h3>Settings coming soon</h3>
                <p>You'll be able to manage your account settings here</p>
            </div>
        </div>
    );
};

export default ProviderDashboard;