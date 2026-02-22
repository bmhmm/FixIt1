// import React, { useState } from 'react';
// import './TodaysJobs.css';

// const TodaysJobs = () => {
//     const [jobs, setJobs] = useState([
//         {
//             id: 1,
//             customer: 'Robert Smith',
//             service: 'AC Repair',
//             time: '09:00 AM',
//             location: '321 Elm Street',
//             status: 'completed',
//             price: '$95'
//         },
//         {
//             id: 2,
//             customer: 'Lisa Wong',
//             service: 'Plumbing Fix',
//             time: '11:30 AM',
//             location: '654 Cedar Rd',
//             status: 'in-progress',
//             price: '$75'
//         },
//         {
//             id: 3,
//             customer: 'David Miller',
//             service: 'Electrical Wiring',
//             time: '02:00 PM',
//             location: '987 Birch Ln',
//             status: 'upcoming',
//             price: '$150'
//         }
//     ]);

//     const updateStatus = (id, newStatus) => {
//         setJobs(jobs.map(job =>
//             job.id === id ? { ...job, status: newStatus } : job
//         ));
//     };

//     return (
//         <div className="todays-jobs">
//             <h2>Today's Schedule</h2>
//             <p className="today-date">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

//             <div className="jobs-list">
//                 {jobs.map(job => (
//                     <div key={job.id} className={`job-card ${job.status}`}>
//                         <div className="job-time">
//                             <span className="time-badge">{job.time}</span>
//                             <span className={`status-indicator ${job.status}`}>
//                                 {job.status === 'completed' ? '✓ Completed' :
//                                     job.status === 'in-progress' ? '⚡ In Progress' :
//                                         '⏳ Upcoming'}
//                             </span>
//                         </div>

//                         <div className="job-content">
//                             <div className="job-header">
//                                 <h3>{job.customer}</h3>
//                                 <span className="job-price">{job.price}</span>
//                             </div>

//                             <p className="job-service">{job.service}</p>

//                             <div className="job-location">
//                                 <span className="location-icon">📍</span>
//                                 {job.location}
//                             </div>

//                             {job.status !== 'completed' && (
//                                 <div className="job-actions">
//                                     {job.status === 'upcoming' && (
//                                         <button
//                                             className="start-btn"
//                                             onClick={() => updateStatus(job.id, 'in-progress')}
//                                         >
//                                             ▶ Start Job
//                                         </button>
//                                     )}
//                                     {job.status === 'in-progress' && (
//                                         <button
//                                             className="complete-btn"
//                                             onClick={() => updateStatus(job.id, 'completed')}
//                                         >
//                                             ✓ Mark Completed
//                                         </button>
//                                     )}
//                                 </div>
//                             )}

//                             {job.status === 'completed' && (
//                                 <div className="completed-actions">
//                                     <button className="view-details">View Details</button>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default TodaysJobs;





import React, { useState, useEffect } from 'react';
import './TodaysJobs.css';

const TodaysJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Later: Fetch from API
        // fetchTodaysJobs();
        setLoading(false);
    }, []);

    const updateStatus = (id, newStatus) => {
        // Later: API call to update status
        alert(`Mark job as ${newStatus} - API will be connected later`);
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="todays-jobs">
            <h2>Today's Schedule</h2>
            <p className="today-date">
                {new Date().toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                })}
            </p>

            <div className="jobs-list">
                {jobs.length === 0 ? (
                    <div className="no-jobs">
                        <span className="empty-icon">📅</span>
                        <h3>No jobs scheduled today</h3>
                        <p>Your schedule will appear here when customers book your services</p>
                    </div>
                ) : (
                    jobs.map(job => (
                        <div key={job.id} className={`job-card ${job.status}`}>
                            <div className="job-time">
                                <span className="time-badge">{job.time}</span>
                                <span className={`status-indicator ${job.status}`}>
                                    {job.status === 'completed' ? '✓ Completed' :
                                        job.status === 'in-progress' ? '⚡ In Progress' :
                                            '⏳ Upcoming'}
                                </span>
                            </div>

                            <div className="job-content">
                                <div className="job-header">
                                    <h3>{job.customer}</h3>
                                    <span className="job-price">{job.price}</span>
                                </div>

                                <p className="job-service">{job.service}</p>

                                <div className="job-location">
                                    <span className="location-icon">📍</span>
                                    {job.location}
                                </div>

                                {job.status !== 'completed' && (
                                    <div className="job-actions">
                                        {job.status === 'upcoming' && (
                                            <button
                                                className="start-btn"
                                                onClick={() => updateStatus(job.id, 'in-progress')}
                                            >
                                                ▶ Start Job
                                            </button>
                                        )}
                                        {job.status === 'in-progress' && (
                                            <button
                                                className="complete-btn"
                                                onClick={() => updateStatus(job.id, 'completed')}
                                            >
                                                ✓ Mark Completed
                                            </button>
                                        )}
                                    </div>
                                )}

                                {job.status === 'completed' && (
                                    <div className="completed-actions">
                                        <button className="view-details">View Details</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TodaysJobs;