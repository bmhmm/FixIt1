// import React, { useState } from 'react';
// import './Earninigs.css';

// const Earnings = () => {
//     const [timeframe, setTimeframe] = useState('week');

//     const earnings = {
//         today: 185,
//         week: 1240,
//         month: 4850,
//         total: 15280
//     };

//     const transactions = [
//         { id: 1, customer: 'Sarah Johnson', service: 'Electrical Repair', amount: 85, date: '2024-02-22', status: 'completed' },
//         { id: 2, customer: 'Mike Peters', service: 'Lighting Installation', amount: 120, date: '2024-02-21', status: 'completed' },
//         { id: 3, customer: 'Emily Chen', service: 'Outlet Repair', amount: 65, date: '2024-02-20', status: 'completed' },
//         { id: 4, customer: 'Robert Smith', service: 'AC Repair', amount: 95, date: '2024-02-19', status: 'completed' },
//     ];

//     return (
//         <div className="earnings">
//             <div className="earnings-header">
//                 <h2>Earnings</h2>
//                 <div className="timeframe-selector">
//                     <button
//                         className={timeframe === 'day' ? 'active' : ''}
//                         onClick={() => setTimeframe('day')}
//                     >Day</button>
//                     <button
//                         className={timeframe === 'week' ? 'active' : ''}
//                         onClick={() => setTimeframe('week')}
//                     >Week</button>
//                     <button
//                         className={timeframe === 'month' ? 'active' : ''}
//                         onClick={() => setTimeframe('month')}
//                     >Month</button>
//                     <button
//                         className={timeframe === 'all' ? 'active' : ''}
//                         onClick={() => setTimeframe('all')}
//                     >All</button>
//                 </div>
//             </div>

//             <div className="earnings-cards">
//                 <div className="earning-card">
//                     <div className="earning-icon">💰</div>
//                     <div className="earning-info">
//                         <p>Today</p>
//                         <h3>${earnings.today}</h3>
//                     </div>
//                 </div>
//                 <div className="earning-card">
//                     <div className="earning-icon">📊</div>
//                     <div className="earning-info">
//                         <p>This Week</p>
//                         <h3>${earnings.week}</h3>
//                     </div>
//                 </div>
//                 <div className="earning-card">
//                     <div className="earning-icon">📅</div>
//                     <div className="earning-info">
//                         <p>This Month</p>
//                         <h3>${earnings.month}</h3>
//                     </div>
//                 </div>
//                 <div className="earning-card">
//                     <div className="earning-icon">🏆</div>
//                     <div className="earning-info">
//                         <p>Total</p>
//                         <h3>${earnings.total}</h3>
//                     </div>
//                 </div>
//             </div>

//             <div className="recent-transactions">
//                 <h3>Recent Transactions</h3>
//                 <div className="transactions-list">
//                     {transactions.map(t => (
//                         <div key={t.id} className="transaction-item">
//                             <div className="transaction-left">
//                                 <div className="transaction-icon">💵</div>
//                                 <div className="transaction-details">
//                                     <h4>{t.customer}</h4>
//                                     <p>{t.service} • {t.date}</p>
//                                 </div>
//                             </div>
//                             <div className="transaction-right">
//                                 <span className="transaction-amount">${t.amount}</span>
//                                 <span className="transaction-status completed">✓ Paid</span>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             <div className="payout-section">
//                 <div className="payout-card">
//                     <h3>Available for Payout</h3>
//                     <p className="payout-amount">$450.00</p>
//                     <button className="payout-btn">Request Payout</button>
//                 </div>
//                 <div className="payout-info">
//                     <p>⏱️ Next payout: Feb 28, 2024</p>
//                     <p>💳 Bank Account: ****1234</p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Earnings;



import React, { useState, useEffect } from 'react';
import './Earninigs.css';

const Earnings = () => {
    const [timeframe, setTimeframe] = useState('week');
    const [earnings, setEarnings] = useState({
        today: 0,
        week: 0,
        month: 0,
        total: 0
    });
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Later: Fetch from API
        // fetchEarnings();
        setLoading(false);
    }, []);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="earnings">
            <div className="earnings-header">
                <h2>Earnings</h2>
                <div className="timeframe-selector">
                    <button
                        className={timeframe === 'day' ? 'active' : ''}
                        onClick={() => setTimeframe('day')}
                    >Day</button>
                    <button
                        className={timeframe === 'week' ? 'active' : ''}
                        onClick={() => setTimeframe('week')}
                    >Week</button>
                    <button
                        className={timeframe === 'month' ? 'active' : ''}
                        onClick={() => setTimeframe('month')}
                    >Month</button>
                    <button
                        className={timeframe === 'all' ? 'active' : ''}
                        onClick={() => setTimeframe('all')}
                    >All</button>
                </div>
            </div>

            <div className="earnings-cards">
                <div className="earning-card">
                    <div className="earning-icon">💰</div>
                    <div className="earning-info">
                        <p>Today</p>
                        <h3>${earnings.today}</h3>
                    </div>
                </div>
                <div className="earning-card">
                    <div className="earning-icon">📊</div>
                    <div className="earning-info">
                        <p>This Week</p>
                        <h3>${earnings.week}</h3>
                    </div>
                </div>
                <div className="earning-card">
                    <div className="earning-icon">📅</div>
                    <div className="earning-info">
                        <p>This Month</p>
                        <h3>${earnings.month}</h3>
                    </div>
                </div>
                <div className="earning-card">
                    <div className="earning-icon">🏆</div>
                    <div className="earning-info">
                        <p>Total</p>
                        <h3>${earnings.total}</h3>
                    </div>
                </div>
            </div>

            <div className="recent-transactions">
                <h3>Recent Transactions</h3>
                {transactions.length === 0 ? (
                    <div className="no-transactions">
                        <p>No transactions yet</p>
                    </div>
                ) : (
                    <div className="transactions-list">
                        {transactions.map(t => (
                            <div key={t.id} className="transaction-item">
                                <div className="transaction-left">
                                    <div className="transaction-icon">💵</div>
                                    <div className="transaction-details">
                                        <h4>{t.customer}</h4>
                                        <p>{t.service} • {t.date}</p>
                                    </div>
                                </div>
                                <div className="transaction-right">
                                    <span className="transaction-amount">${t.amount}</span>
                                    <span className="transaction-status completed">✓ Paid</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="payout-section">
                <div className="payout-card">
                    <h3>Available for Payout</h3>
                    <p className="payout-amount">$0.00</p>
                    <button className="payout-btn" disabled>Request Payout</button>
                </div>
                <div className="payout-info">
                    <p>⏱️ Next payout: When you complete your first job</p>
                    <p>💳 Bank Account: Not connected</p>
                </div>
            </div>
        </div>
    );
};

export default Earnings;