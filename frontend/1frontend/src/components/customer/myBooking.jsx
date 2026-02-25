import React, { useState, useEffect } from 'react';
import './MyBooking.css';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Later: Fetch bookings from API
        // fetchBookings();
        setLoading(false);
    }, [activeTab]);

    // const fetchBookings = async () => {
    //     try {
    //         const token = localStorage.getItem('token');
    //         const response = await axios.get(`http://localhost:5000/api/customer/bookings?status=${activeTab}`, {
    //             headers: { Authorization: `Bearer ${token}` }
    //         });
    //         setBookings(response.data.data);
    //     } catch (error) {
    //         console.error('Error fetching bookings:', error);
    //     }
    // };

    const tabs = [
        { id: 'upcoming', label: 'Upcoming', icon: '⏳' },
        { id: 'pending', label: 'Pending', icon: '⏱️' },
        { id: 'completed', label: 'Completed', icon: '✅' },
        { id: 'cancelled', label: 'Cancelled', icon: '❌' }
    ];

    if (loading) {
        return <div className="loading-spinner">Loading...</div>;
    }

    return (
        <div className="my-bookings">
            <div className="bookings-header">
                <h2>My Bookings</h2>

                <div className="booking-tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span className="tab-icon">{tab.icon}</span>
                            <span className="tab-label">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {bookings.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">📅</span>
                    <h3>No {activeTab} bookings</h3>
                    <p>When you book services, they'll appear here</p>
                    <button className="browse-btn" onClick={() => window.location.href = '/customer/search'}>
                        Find Services
                    </button>
                </div>
            ) : (
                <div className="bookings-list">
                    {bookings.map(booking => (
                        <div key={booking.id} className="booking-card">
                            <div className="booking-status">
                                <span className={`status-badge ${booking.status}`}>
                                    {booking.status}
                                </span>
                            </div>

                            <div className="booking-content">
                                <div className="booking-header">
                                    <div className="provider-mini">
                                        <div className="mini-avatar">👨‍🔧</div>
                                        <div>
                                            <h4>{booking.provider_name}</h4>
                                            <p className="service-type">{booking.service}</p>
                                        </div>
                                    </div>
                                    <div className="booking-price">${booking.price}</div>
                                </div>

                                <div className="booking-details">
                                    <div className="detail">
                                        <span className="detail-icon">📅</span>
                                        <span>{booking.date} at {booking.time}</span>
                                    </div>
                                    <div className="detail">
                                        <span className="detail-icon">📍</span>
                                        <span>{booking.address}</span>
                                    </div>
                                </div>

                                <div className="booking-actions">
                                    {booking.status === 'pending' && (
                                        <>
                                            <button className="cancel-booking">Cancel Request</button>
                                            <button className="contact-provider">Contact Provider</button>
                                        </>
                                    )}

                                    {booking.status === 'upcoming' && (
                                        <>
                                            <button className="reschedule-btn">Reschedule</button>
                                            <button className="contact-provider">Message Provider</button>
                                        </>
                                    )}

                                    {booking.status === 'completed' && (
                                        <>
                                            <button className="review-btn">Write a Review</button>
                                            <button className="book-again">Book Again</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;