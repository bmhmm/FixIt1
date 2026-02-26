import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './providerProfileView.css';

const ProviderProfileView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Later: Fetch provider details from API
        // fetchProviderDetails();
        setLoading(false);
    }, [id]);

    // const fetchProviderDetails = async () => {
    //     try {
    //         const token = localStorage.getItem('token');
    //         const response = await axios.get(`http://localhost:5000/api/customer/provider/${id}`, {
    //             headers: { Authorization: `Bearer ${token}` }
    //         });
    //         setProvider(response.data.data);
    //     } catch (error) {
    //         console.error('Error fetching provider:', error);
    //     }
    // };

    const handleBookNow = () => {
        navigate(`/customer/book/${id}`);
    };

    if (loading) {
        return <div className="loading-spinner">Loading...</div>;
    }

    if (!provider) {
        return (
            <div className="not-found">
                <span className="empty-icon">👨‍🔧</span>
                <h3>Provider Not Found</h3>
                <p>The provider you're looking for doesn't exist</p>
                <button className="back-btn" onClick={() => navigate('/customer/providers')}>
                    Browse Providers
                </button>
            </div>
        );
    }

    return (
        <div className="provider-profile-view">
            <button className="back-btn" onClick={() => navigate(-1)}>
                ← Back to Providers
            </button>

            <div className="profile-content">
                <div className="profile-header-card">
                    <div className="profile-avatar-large">
                        {provider?.profile_image ? (
                            <img src={provider.profile_image} alt={provider.name} />
                        ) : (
                            <span>👨‍🔧</span>
                        )}
                    </div>

                    <div className="profile-header-info">
                        <h1>{provider?.name || 'Provider Name'}</h1>
                        <p className="profession">{provider?.profession || 'Profession'}</p>

                        <div className="profile-stats">
                            <div className="stat">
                                <span className="stat-value">⭐ {provider?.rating || '0.0'}</span>
                                <span className="stat-label">Rating</span>
                            </div>
                            <div className="stat">
                                <span className="stat-value">{provider?.reviews || 0}</span>
                                <span className="stat-label">Reviews</span>
                            </div>
                            <div className="stat">
                                <span className="stat-value">{provider?.jobs_completed || 0}</span>
                                <span className="stat-label">Jobs</span>
                            </div>
                            <div className="stat">
                                <span className="stat-value">{provider?.years_experience || 0}</span>
                                <span className="stat-label">Years</span>
                            </div>
                        </div>

                        <button className="book-now-large" onClick={handleBookNow}>
                            Book This Professional
                        </button>
                    </div>
                </div>

                <div className="profile-details-grid">
                    <div className="detail-card">
                        <h3>About</h3>
                        <p className="bio">
                            {provider?.bio || 'No bio added yet. This provider hasn\'t added information about themselves.'}
                        </p>
                    </div>

                    <div className="detail-card">
                        <h3>Services & Pricing</h3>
                        <div className="services-list">
                            {provider?.services?.length > 0 ? (
                                provider.services.map((service, index) => (
                                    <div key={index} className="service-item">
                                        <span>{service.name}</span>
                                        <span className="service-price">${service.price}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="empty-text">No services listed</p>
                            )}
                        </div>
                        <div className="hourly-rate">
                            <strong>Hourly Rate:</strong> ${provider?.hourly_rate || '0'}/hour
                        </div>
                    </div>

                    <div className="detail-card">
                        <h3>Location & Availability</h3>
                        <div className="info-item">
                            <span className="info-icon">📍</span>
                            <span>{provider?.location || 'Location not set'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-icon">📅</span>
                            <span>{provider?.availability || 'Availability not set'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-icon">⏱️</span>
                            <span>Response time: {provider?.response_time || 'N/A'}</span>
                        </div>
                    </div>

                    <div className="detail-card">
                        <h3>Verification</h3>
                        <div className="verification-badges">
                            <div className={`badge ${provider?.id_verified ? 'verified' : 'pending'}`}>
                                {provider?.id_verified ? '✓' : '○'} ID Verified
                            </div>
                            <div className={`badge ${provider?.phone_verified ? 'verified' : 'pending'}`}>
                                {provider?.phone_verified ? '✓' : '○'} Phone Verified
                            </div>
                            <div className={`badge ${provider?.email_verified ? 'verified' : 'pending'}`}>
                                {provider?.email_verified ? '✓' : '○'} Email Verified
                            </div>
                        </div>
                    </div>
                </div>

                <div className="reviews-section">
                    <h3>Reviews ({provider?.reviews || 0})</h3>

                    <div className="reviews-summary">
                        <div className="average-rating">
                            <span className="big-rating">{provider?.rating || '0.0'}</span>
                            <span className="stars">⭐⭐⭐⭐⭐</span>
                            <span>Based on {provider?.reviews || 0} reviews</span>
                        </div>

                        <div className="rating-bars">
                            {[5, 4, 3, 2, 1].map(star => (
                                <div key={star} className="rating-bar-item">
                                    <span>{star} ⭐</span>
                                    <div className="bar-container">
                                        <div className="bar" style={{ width: '0%' }}></div>
                                    </div>
                                    <span>0</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="reviews-list">
                        <div className="empty-state small">
                            <p>No reviews yet</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProviderProfileView;