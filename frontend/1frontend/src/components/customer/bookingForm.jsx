import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BookingForm.css';

const BookingForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [provider, setProvider] = useState(null);
    const [formData, setFormData] = useState({
        service: '',
        date: '',
        time: '',
        duration: '1',
        address: '',
        description: '',
        urgent: false
    });

    useEffect(() => {
        // Later: Fetch provider details
        // fetchProviderDetails();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Booking request sent! - API will be connected later');
        // Later: Submit to API
        navigate('/customer/my-bookings');
    };

    return (
        <div className="booking-form">
            <button className="back-btn" onClick={() => navigate(-1)}>
                ← Back
            </button>

            <div className="form-container">
                <h2>Book a Service</h2>

                <div className="provider-summary">
                    <div className="provider-avatar-small">👨‍🔧</div>
                    <div className="provider-info">
                        <h3>{provider?.name || 'Provider Name'}</h3>
                        <p>{provider?.profession || 'Profession'}</p>
                    </div>
                    <div className="provider-rate">
                        <span className="rate">${provider?.hourly_rate || '0'}</span>
                        <span className="rate-label">/hour</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Service Type</label>
                        <select
                            name="service"
                            value={formData.service}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a service</option>
                            <option value="repair">Repair</option>
                            <option value="installation">Installation</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="inspection">Inspection</option>
                        </select>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Date</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                min={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Time</label>
                            <input
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Duration (hours)</label>
                            <select
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(h => (
                                    <option key={h} value={h}>{h} hour{h > 1 ? 's' : ''}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Estimated Total</label>
                            <div className="estimated-total">
                                ${(parseInt(formData.duration) * (parseInt(provider?.hourly_rate) || 0)) || 0}
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Service Address</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter your full address"
                            rows="2"
                            required
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label>Job Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe what you need done..."
                            rows="3"
                            required
                        ></textarea>
                    </div>

                    <div className="form-group checkbox">
                        <label>
                            <input
                                type="checkbox"
                                name="urgent"
                                checked={formData.urgent}
                                onChange={handleChange}
                            />
                            This is urgent (priority handling)
                        </label>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-booking" disabled={loading}>
                            {loading ? 'Sending...' : 'Send Booking Request'}
                        </button>
                    </div>
                </form>

                <div className="booking-info">
                    <h4>What happens next?</h4>
                    <ol>
                        <li>Provider will receive your request</li>
                        <li>They'll confirm availability within 24 hours</li>
                        <li>You'll get notification when accepted</li>
                        <li>Pay securely after service is completed</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default BookingForm;