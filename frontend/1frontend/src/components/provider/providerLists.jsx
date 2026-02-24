import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProviderList.css';

const ProviderList = () => {
    const navigate = useNavigate();
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('rating');

    useEffect(() => {
        // Later: Fetch providers from API
        // fetchProviders();
        setLoading(false);
    }, []);

    // const fetchProviders = async () => {
    //     try {
    //         const token = localStorage.getItem('token');
    //         const response = await axios.get('http://localhost:5000/api/customer/providers', {
    //             headers: { Authorization: `Bearer ${token}` }
    //         });
    //         setProviders(response.data.data);
    //     } catch (error) {
    //         console.error('Error fetching providers:', error);
    //     }
    // };

    const handleViewProfile = (providerId) => {
        navigate(`/customer/provider/${providerId}`);
    };

    const categories = ['All', 'Plumbing', 'Electrical', 'Cleaning', 'Tutoring', 'Carpentry', 'Painting'];

    if (loading) {
        return <div className="loading-spinner">Loading...</div>;
    }

    return (
        <div className="provider-list">
            <div className="list-header">
                <h2>Find Professionals</h2>
                <p>Browse trusted providers in your area</p>
            </div>

            <div className="filters-section">
                <div className="filter-tabs">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`filter-tab ${filter === cat.toLowerCase() ? 'active' : ''}`}
                            onClick={() => setFilter(cat.toLowerCase())}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="sort-options">
                    <label>Sort by:</label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="rating">Top Rated</option>
                        <option value="reviews">Most Reviews</option>
                        <option value="price_low">Price: Low to High</option>
                        <option value="price_high">Price: High to Low</option>
                    </select>
                </div>
            </div>

            {providers.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">👥</span>
                    <h3>No providers found</h3>
                    <p>Try adjusting your filters or check back later</p>
                    <div className="suggestions">
                        <h4>Popular categories:</h4>
                        <div className="suggestion-tags">
                            <span>🔧 Plumbers</span>
                            <span>⚡ Electricians</span>
                            <span>🧹 Cleaners</span>
                            <span>📚 Tutors</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="providers-grid">
                    {providers.map(provider => (
                        <div key={provider.id} className="provider-card">
                            <div className="provider-card-header">
                                <div className="provider-avatar">
                                    {provider.profile_image ? (
                                        <img src={provider.profile_image} alt={provider.name} />
                                    ) : (
                                        <span>👨‍🔧</span>
                                    )}
                                </div>
                                <div className="provider-info">
                                    <h3>{provider.name}</h3>
                                    <p className="provider-profession">{provider.profession}</p>
                                    <div className="provider-rating">
                                        <span className="stars">⭐</span>
                                        <span>{provider.rating || '0.0'}</span>
                                        <span className="reviews-count">({provider.reviews || 0} reviews)</span>
                                    </div>
                                </div>
                                <button className="favorite-btn">❤️</button>
                            </div>

                            <div className="provider-details">
                                <div className="detail">
                                    <span className="detail-icon">📍</span>
                                    <span>{provider.location || 'Location not set'}</span>
                                </div>
                                <div className="detail">
                                    <span className="detail-icon">💰</span>
                                    <span>${provider.hourly_rate || '0'}/hr</span>
                                </div>
                                <div className="detail">
                                    <span className="detail-icon">✅</span>
                                    <span>{provider.jobs_completed || 0} jobs completed</span>
                                </div>
                            </div>

                            <div className="provider-card-footer">
                                <button
                                    className="view-profile-btn"
                                    onClick={() => handleViewProfile(provider.id)}
                                >
                                    View Profile
                                </button>
                                <button className="book-now-btn">Book Now</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProviderList;