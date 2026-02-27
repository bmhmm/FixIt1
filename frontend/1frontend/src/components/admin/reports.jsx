import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Reports.css';

const Reports = () => {
    const [reportType, setReportType] = useState('revenue');
    const [period, setPeriod] = useState('month');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, [reportType, period]);

    const fetchReports = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:5000/api/admin/reports?type=${reportType}&period=${period}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setData(response.data.data);
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reports">
            <div className="reports-header">
                <h2>Reports & Analytics</h2>
                <div className="report-controls">
                    <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                        <option value="revenue">Revenue Report</option>
                        <option value="users">User Growth</option>
                        <option value="bookings">Booking Statistics</option>
                        <option value="providers">Provider Performance</option>
                    </select>
                    <select value={period} onChange={(e) => setPeriod(e.target.value)}>
                        <option value="week">Last 7 Days</option>
                        <option value="month">Last 30 Days</option>
                        <option value="quarter">Last 90 Days</option>
                        <option value="year">This Year</option>
                    </select>
                    <button className="export-btn">📥 Export Report</button>
                </div>
            </div>

            {loading ? (
                <div className="loading-spinner">Loading...</div>
            ) : (
                <div className="reports-grid">
                    <div className="summary-cards">
                        <div className="summary-card">
                            <h3>Total Revenue</h3>
                            <p className="summary-value">${data?.totalRevenue || 0}</p>
                            <span className="trend positive">↑ 12%</span>
                        </div>
                        <div className="summary-card">
                            <h3>Total Bookings</h3>
                            <p className="summary-value">{data?.totalBookings || 0}</p>
                            <span className="trend positive">↑ 8%</span>
                        </div>
                        <div className="summary-card">
                            <h3>New Users</h3>
                            <p className="summary-value">{data?.newUsers || 0}</p>
                            <span className="trend positive">↑ 15%</span>
                        </div>
                        <div className="summary-card">
                            <h3>Avg. Booking Value</h3>
                            <p className="summary-value">${data?.avgBookingValue || 0}</p>
                            <span className="trend negative">↓ 3%</span>
                        </div>
                    </div>

                    <div className="chart-placeholder">
                        <h3>Revenue Overview</h3>
                        <div className="empty-chart">
                            <p>📊 Chart visualization will appear here</p>
                            <p className="chart-note">(Integrate with Chart.js or Recharts)</p>
                        </div>
                    </div>

                    <div className="top-providers">
                        <h3>Top Performing Providers</h3>
                        <table className="mini-table">
                            <thead>
                                <tr>
                                    <th>Provider</th>
                                    <th>Jobs</th>
                                    <th>Revenue</th>
                                    <th>Rating</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.topProviders?.map(p => (
                                    <tr key={p.id}>
                                        <td>{p.name}</td>
                                        <td>{p.jobs}</td>
                                        <td>${p.revenue}</td>
                                        <td>⭐ {p.rating}</td>
                                    </tr>
                                )) || (
                                        <tr>
                                            <td colSpan="4" className="empty-data">No data available</td>
                                        </tr>
                                    )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;