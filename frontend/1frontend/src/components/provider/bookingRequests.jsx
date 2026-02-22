// import React, { useState } from 'react';
// import './BookingRequests.css';

// const BookingRequests = () => {
//     const [requests, setRequests] = useState([
//         {
//             id: 1,
//             customer: 'Sarah Johnson',
//             service: 'Electrical Repair',
//             date: '2024-02-23',
//             time: '14:00',
//             location: '123 Main St, Apt 4B',
//             status: 'pending',
//             price: '$85',
//             message: 'Need help with circuit breaker'
//         },
//         {
//             id: 2,
//             customer: 'Mike Peters',
//             service: 'Lighting Installation',
//             date: '2024-02-24',
//             time: '10:30',
//             location: '456 Oak Ave',
//             status: 'pending',
//             price: '$120',
//             message: 'Install 3 new ceiling lights'
//         },
//         {
//             id: 3,
//             customer: 'Emily Chen',
//             service: 'Outlet Repair',
//             date: '2024-02-23',
//             time: '16:00',
//             location: '789 Pine St',
//             status: 'pending',
//             price: '$65',
//             message: 'Outlet not working in kitchen'
//         }
//     ]);

//     const handleAccept = (id) => {
//         setRequests(requests.filter(req => req.id !== id));
//         alert('Booking accepted!');
//     };

//     const handleDecline = (id) => {
//         setRequests(requests.filter(req => req.id !== id));
//         alert('Booking declined');
//     };

//     return (
//         <div className="booking-requests">
//             <div className="requests-header">
//                 <h2>Booking Requests</h2>
//                 <p>{requests.length} pending requests</p>
//             </div>

//             <div className="requests-list">
//                 {requests.length === 0 ? (
//                     <div className="no-requests">
//                         <span className="empty-icon">📭</span>
//                         <h3>No pending requests</h3>
//                         <p>You're all caught up!</p>
//                     </div>
//                 ) : (
//                     requests.map(request => (
//                         <div key={request.id} className="request-card">
//                             <div className="request-status">
//                                 <span className="status-badge pending">New Request</span>
//                             </div>

//                             <div className="request-content">
//                                 <div className="request-header">
//                                     <div className="customer-info">
//                                         <h3>{request.customer}</h3>
//                                         <span className="service-type">{request.service}</span>
//                                     </div>
//                                     <div className="request-price">{request.price}</div>
//                                 </div>

//                                 <div className="request-details">
//                                     <div className="detail-item">
//                                         <span className="detail-icon">📅</span>
//                                         <span>{request.date} at {request.time}</span>
//                                     </div>
//                                     <div className="detail-item">
//                                         <span className="detail-icon">📍</span>
//                                         <span>{request.location}</span>
//                                     </div>
//                                     <div className="detail-item message">
//                                         <span className="detail-icon">💬</span>
//                                         <span>"{request.message}"</span>
//                                     </div>
//                                 </div>

//                                 <div className="request-actions">
//                                     <button
//                                         className="accept-btn"
//                                         onClick={() => handleAccept(request.id)}
//                                     >
//                                         ✓ Accept
//                                     </button>
//                                     <button
//                                         className="decline-btn"
//                                         onClick={() => handleDecline(request.id)}
//                                     >
//                                         ✕ Decline
//                                     </button>
//                                     <button className="view-details-btn">
//                                         View Details
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     ))
//                 )}
//             </div>
//         </div>
//     );
// };

// export default BookingRequests;


import React, { useState, useEffect } from 'react';
import './BookingRequests.css';

const BookingRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Later: Fetch from API
        // fetchBookingRequests();
        setLoading(false);
    }, []);

    const handleAccept = (id) => {
        // Later: API call to accept
        alert('Accept booking - API will be connected later');
    };

    const handleDecline = (id) => {
        // Later: API call to decline
        alert('Decline booking - API will be connected later');
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="booking-requests">
            <div className="requests-header">
                <h2>Booking Requests</h2>
                <p>{requests.length} pending requests</p>
            </div>

            <div className="requests-list">
                {requests.length === 0 ? (
                    <div className="no-requests">
                        <span className="empty-icon">📭</span>
                        <h3>No pending requests</h3>
                        <p>When customers book your services, they'll appear here</p>
                    </div>
                ) : (
                    requests.map(request => (
                        <div key={request.id} className="request-card">
                            <div className="request-status">
                                <span className="status-badge pending">New Request</span>
                            </div>

                            <div className="request-content">
                                <div className="request-header">
                                    <div className="customer-info">
                                        <h3>{request.customer}</h3>
                                        <span className="service-type">{request.service}</span>
                                    </div>
                                    <div className="request-price">{request.price}</div>
                                </div>

                                <div className="request-details">
                                    <div className="detail-item">
                                        <span className="detail-icon">📅</span>
                                        <span>{request.date} at {request.time}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-icon">📍</span>
                                        <span>{request.location}</span>
                                    </div>
                                    <div className="detail-item message">
                                        <span className="detail-icon">💬</span>
                                        <span>"{request.message}"</span>
                                    </div>
                                </div>

                                <div className="request-actions">
                                    <button
                                        className="accept-btn"
                                        onClick={() => handleAccept(request.id)}
                                    >
                                        ✓ Accept
                                    </button>
                                    <button
                                        className="decline-btn"
                                        onClick={() => handleDecline(request.id)}
                                    >
                                        ✕ Decline
                                    </button>
                                    <button className="view-details-btn">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default BookingRequests;