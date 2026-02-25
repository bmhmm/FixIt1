import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Favorites.css';

const Favorites = () => {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/customer/favorites', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFavorites(response.data.data);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFavorite = async (providerId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/customer/favorites/${providerId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Remove from list
            setFavorites(favorites.filter(f => f.id !== providerId));
        } catch (error) {
            console.error('Error removing favorite:', error);
        }
    };

    const handleViewProfile = (providerId) => {
        navigate(`/customer/provider/${providerId}`);
    };

    if (loading) {
        return (
            <div className="favorites-loading">
                <div className="loading-spinner"></div>
                <p>Loading your favorites...</p>
            </div>
        );
    }

    return (
        <div className="favorites-page">
            <div className="favorites-header">
                <h2>My Favorite Providers</h2>
                <p>You have {favorites.length} saved providers</p>
            </div>

            {favorites.length === 0 ? (
                <div className="empty-favorites">
                    <span className="empty-icon">❤️</span>
                    <h3>No favorites yet</h3>
                    <p>When you favorite providers, they'll appear here</p>
                    <button
                        className="browse-btn"
                        onClick={() => navigate('/customer/providers')}
                    >
                        Browse Providers
                    </button>
                </div>
            ) : (
                <div className="favorites-grid">
                    {favorites.map(provider => (
                        <div key={provider.id} className="favorite-card">
                            <button
                                className="remove-favorite"
                                onClick={() => handleRemoveFavorite(provider.id)}
                                title="Remove from favorites"
                            >
                                ✕
                            </button>

                            <div className="favorite-content">
                                <div className="provider-avatar">
                                    {provider.profile_image ? (
                                        <img src={provider.profile_image} alt={provider.name} />
                                    ) : (
                                        <span>👨‍🔧</span>
                                    )}
                                </div>

                                <h3>{provider.name}</h3>
                                <p className="provider-location">{provider.location}</p>

                                <div className="provider-rating">
                                    <span className="stars">⭐</span>
                                    <span>{provider.rating}</span>
                                    <span className="reviews-count">({provider.reviews} reviews)</span>
                                </div>

                                <div className="provider-rate">
                                    <span className="rate">${provider.hourly_rate}</span>
                                    <span className="rate-label">/hour</span>
                                </div>

                                <button
                                    className="view-profile-btn"
                                    onClick={() => handleViewProfile(provider.id)}
                                >
                                    View Profile
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;