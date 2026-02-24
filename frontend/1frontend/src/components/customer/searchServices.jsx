import React, { useState } from 'react';
import './SearchServices.css';

const SearchServices = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('all');

    const categories = [
        'All Services',
        '🔧 Plumbing',
        '⚡ Electrical',
        '🧹 Cleaning',
        '📚 Tutoring',
        '🔨 Carpentry',
        '🎨 Painting'
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        alert(`Searching for "${searchTerm}" - API will be connected later`);
    };

    return (
        <div className="search-services">
            <h2>Find Services</h2>

            <form onSubmit={handleSearch} className="search-form">
                <div className="search-input-wrapper">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="What service do you need? (e.g., plumber, electrician)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="search-btn">Search</button>
                </div>
            </form>

            <div className="categories-section">
                <h3>Browse Categories</h3>
                <div className="categories-grid">
                    {categories.map((cat, index) => (
                        <button
                            key={index}
                            className={`category-card ${category === cat.toLowerCase() ? 'active' : ''}`}
                            onClick={() => {
                                setCategory(cat.toLowerCase());
                                alert(`Browse ${cat} - API will be connected later`);
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="popular-services">
                <h3>Popular Services Near You</h3>
                <div className="empty-state">
                    <span className="empty-icon">📍</span>
                    <p>No services found in your area</p>
                    <p className="empty-hint">Try searching or browsing categories above</p>
                </div>
            </div>
        </div>
    );
};

export default SearchServices;