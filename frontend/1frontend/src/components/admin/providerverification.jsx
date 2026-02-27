import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProviderVerification.css';

const ProviderVerification = () => {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProvider, setSelectedProvider] = useState(null);

    useEffect(() => {
        fetchPendingProviders();
    }, []);

    const fetchPendingProviders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/admin/providers/pending', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProviders(response.data.data);
        } catch (error) {
            console.error('Error fetching providers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (providerId, approved) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/admin/providers/${providerId}/verify`,
                { verified: approved },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setProviders(providers.filter(p => p.id !== providerId));
            setSelectedProvider(null);
        } catch (error) {
            console.error('Error verifying provider:', error);
        }
    };

    return (
        <div className="provider-verification">
            <h2>Provider Verification Requests</h2>

            {selectedProvider ? (
                <div className="verification-detail">
                    <button className="back-btn" onClick={() => setSelectedProvider(null)}>
                        ← Back to List
                    </button>

                    <div className="provider-detail-card">
                        <div className="detail-header">
                            <div className="provider-avatar-large">👨‍🔧</div>
                            <div>
                                <h3>{selectedProvider.full_name}</h3>
                                <p>{selectedProvider.profession}</p>
                            </div>
                        </div>

                        <div className="detail-section">
                            <h4>Contact Information</h4>
                            <p>📧 {selectedProvider.email}</p>
                            <p>📞 {selectedProvider.phone || 'Not provided'}</p>
                            <p>📍 {selectedProvider.location || 'Not provided'}</p>
                        </div>

                        <div className="detail-section">
                            <h4>Professional Information</h4>
                            <p>💼 Experience: {selectedProvider.experience || 'Not specified'} years</p>
                            <p>💰 Hourly Rate: ${selectedProvider.hourly_rate || 'Not set'}</p>
                            <p>📋 Services: {selectedProvider.services?.join(', ') || 'None listed'}</p>
                        </div>

                        <div className="detail-section">
                            <h4>Submitted Documents</h4>
                            <div className="documents-list">
                                {selectedProvider.documents?.map(doc => (
                                    <a key={doc.id} href={doc.url} className="document-item">
                                        📄 {doc.name}
                                    </a>
                                )) || <p>No documents uploaded</p>}
                            </div>
                        </div>

                        <div className="verification-actions">
                            <button
                                className="approve-btn"
                                onClick={() => handleVerify(selectedProvider.id, true)}
                            >
                                ✅ Approve Provider
                            </button>
                            <button
                                className="reject-btn"
                                onClick={() => handleVerify(selectedProvider.id, false)}
                            >
                                ❌ Reject Application
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="providers-list">
                    {loading ? (
                        <div className="loading-spinner">Loading...</div>
                    ) : providers.length === 0 ? (
                        <div className="empty-state">
                            <span className="empty-icon">✅</span>
                            <h3>No pending verifications</h3>
                            <p>All providers have been verified</p>
                        </div>
                    ) : (
                        providers.map(provider => (
                            <div key={provider.id} className="provider-card">
                                <div className="provider-card-header">
                                    <div className="provider-avatar">👨‍🔧</div>
                                    <div className="provider-info">
                                        <h3>{provider.full_name}</h3>
                                        <p>{provider.profession}</p>
                                    </div>
                                    <span className="pending-badge">Pending</span>
                                </div>
                                <div className="provider-card-body">
                                    <p>📧 {provider.email}</p>
                                    <p>📞 {provider.phone || 'No phone'}</p>
                                    <p>📅 Applied: {new Date(provider.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="provider-card-footer">
                                    <button
                                        className="review-btn"
                                        onClick={() => setSelectedProvider(provider)}
                                    >
                                        Review Application
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default ProviderVerification;