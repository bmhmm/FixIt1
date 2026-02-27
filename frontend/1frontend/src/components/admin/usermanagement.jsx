import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserManagement.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchUsers();
    }, [filter]);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/api/admin/users?type=${filter}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (userId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/admin/users/${userId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchUsers(); // Refresh list
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const filteredUsers = users.filter(user =>
        user.full_name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="user-management">
            <div className="management-header">
                <h2>User Management</h2>
                <div className="header-actions">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                    />
                    <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="all">All Users</option>
                        <option value="customer">Customers</option>
                        <option value="provider">Providers</option>
                        <option value="admin">Admins</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="loading-spinner">Loading...</div>
            ) : (
                <div className="users-table">
                    <table>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td>
                                        <div className="user-info">
                                            <div className="user-avatar">
                                                {user.user_type === 'provider' ? '👨‍🔧' :
                                                    user.user_type === 'admin' ? '👑' : '👤'}
                                            </div>
                                            <span>{user.full_name}</span>
                                        </div>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`user-type ${user.user_type}`}>
                                            {user.user_type}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${user.is_active ? 'active' : 'suspended'}`}>
                                            {user.is_active ? 'Active' : 'Suspended'}
                                        </span>
                                    </td>
                                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="view-btn"
                                                onClick={() => alert(`View user ${user.id}`)}
                                            >👁️</button>
                                            <button
                                                className={user.is_active ? 'suspend-btn' : 'activate-btn'}
                                                onClick={() => handleStatusChange(user.id, !user.is_active)}
                                            >
                                                {user.is_active ? '🔒' : '🔓'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UserManagement;