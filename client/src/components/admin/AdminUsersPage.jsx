import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './AdminUsers.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AdminUsersPage = () => {
    const { token, user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [actionLoading, setActionLoading] = useState(null); // tracks which user ID is loading
    const [actionError, setActionError] = useState(''); // Bug Fix: user-facing error messages
    // Bug Fix BUG-H2: pagination state
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
    const [actionSuccess, setActionSuccess] = useState('');

    const fetchUsers = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (roleFilter) params.append('role', roleFilter);
            if (statusFilter) params.append('status', statusFilter);
            params.append('page', page);
            params.append('limit', 20);

            const res = await axios.get(`${API_URL}/admin/users?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Bug Fix BUG-H2: handle paginated response shape
            setUsers(res.data.data);
            setPagination(res.data.pagination);
        } catch (err) {
            console.error('Failed to load users:', err);
        } finally {
            setLoading(false);
        }
    }, [token, search, roleFilter, statusFilter, page]);

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchUsers();
        }, 300);
        return () => clearTimeout(debounce);
    }, [fetchUsers]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setPage(1);
    }, [search, roleFilter, statusFilter]);

    const handleSuspend = async (userId) => {
        // Bug Fix: prevent admin from suspending themselves
        if (currentUser?._id === userId) {
            setActionError('You cannot suspend your own account');
            setTimeout(() => setActionError(''), 3000);
            return;
        }
        setActionLoading(userId);
        setActionError('');
        try {
            const res = await axios.put(`${API_URL}/admin/users/${userId}/suspend`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(prev => prev.map(u =>
                u._id === userId ? { ...u, isSuspended: res.data.isSuspended } : u
            ));
            setActionSuccess(res.data.isSuspended ? 'User suspended' : 'User unsuspended');
            setTimeout(() => setActionSuccess(''), 3000);
            refreshAfterAction(); // BUG-M2: refresh DB-level stats
        } catch (err) {
            // Bug Fix: show error to user instead of silent console.error
            setActionError(err.response?.data?.message || 'Failed to suspend/unsuspend user');
            setTimeout(() => setActionError(''), 3000);
        } finally {
            setActionLoading(null);
        }
    };

    const handleVerification = async (userId, action) => {
        setActionLoading(userId);
        setActionError('');
        try {
            const res = await axios.put(`${API_URL}/admin/users/${userId}/verify`, { action }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(prev => prev.map(u =>
                u._id === userId ? {
                    ...u,
                    verificationStatus: res.data.verificationStatus,
                    isVerified: action === 'approve'
                } : u
            ));
            setActionSuccess(`Verification ${action}d successfully`);
            setTimeout(() => setActionSuccess(''), 3000);
            refreshAfterAction(); // BUG-M2: refresh DB-level stats
        } catch (err) {
            // Bug Fix: show error to user instead of silent console.error
            setActionError(err.response?.data?.message || 'Verification action failed');
            setTimeout(() => setActionError(''), 3000);
        } finally {
            setActionLoading(null);
        }
    };

    // Bug Fix BUG-M2: fetch true DB-level stats from dedicated endpoint
    const [stats, setStats] = useState({ total: 0, verified: 0, pending: 0, suspended: 0 });

    const fetchStats = useCallback(async () => {
        try {
            const res = await axios.get(`${API_URL}/admin/stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(res.data);
        } catch (err) {
            console.error('Failed to load stats:', err);
        }
    }, [token]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    // Refresh stats after suspend/verify actions
    const refreshAfterAction = () => {
        fetchStats();
    };

    const totalUsers = stats.total;
    const verifiedCount = stats.verified;
    const pendingCount = stats.pending;
    const suspendedCount = stats.suspended;

    if (loading) return <div className="loading-screen">Loading users...</div>;

    return (
        <div className="admin-users-page">
            <div className="admin-users-container">
                {/* Header */}
                <div className="admin-header">
                    <h1>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        User Management
                        <span className="user-count">({totalUsers} users)</span>
                    </h1>
                </div>

                {/* Bug Fix: user-facing action feedback */}
                {actionError && <div className="admin-action-error">{actionError}</div>}
                {actionSuccess && <div className="admin-action-success">{actionSuccess}</div>}

                {/* Stats */}
                <div className="admin-stats-bar">
                    <div className="admin-stat">
                        <span className="stat-number accent">{totalUsers}</span>
                        <span className="stat-text">Total Users</span>
                    </div>
                    <div className="admin-stat">
                        <span className="stat-number green">{verifiedCount}</span>
                        <span className="stat-text">Verified</span>
                    </div>
                    <div className="admin-stat">
                        <span className="stat-number orange">{pendingCount}</span>
                        <span className="stat-text">Pending Review</span>
                    </div>
                    <div className="admin-stat">
                        <span className="stat-number red">{suspendedCount}</span>
                        <span className="stat-text">Suspended</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="admin-controls">
                    <div className="search-input-wrapper">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <input
                            type="text"
                            className="admin-search-input"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        className="admin-filter-select"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="">All Roles</option>
                        <option value="donor">Donor</option>
                        <option value="admin">Admin</option>
                    </select>
                    <select
                        className="admin-filter-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="verified">Verified</option>
                        <option value="pending">Pending Verification</option>
                    </select>
                </div>

                {/* Table */}
                {users.length === 0 ? (
                    <div className="admin-empty">
                        <div className="empty-icon">👥</div>
                        <p>No users found matching your filters.</p>
                    </div>
                ) : (
                    <div className="users-table-wrapper">
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Blood Type</th>
                                    <th>City</th>
                                    <th>Donations</th>
                                    <th>Verification</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user._id} className={user.isSuspended ? 'row-suspended' : ''}>
                                        <td>
                                            <div className="user-cell">
                                                <div className="user-cell-avatar">
                                                    {user.name?.charAt(0)?.toUpperCase()}
                                                </div>
                                                <div className="user-cell-info">
                                                    <span className="user-cell-name">
                                                        {user.name}
                                                        {user.isVerified && <span className="mini-verified">✓</span>}
                                                    </span>
                                                    <span className="user-cell-email">{user.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="blood-type-badge">{user.bloodType}</span>
                                        </td>
                                        <td>{user.city || '—'}</td>
                                        <td>{user.donationCount || 0}</td>
                                        <td>
                                            <span className={`verification-badge-status v-${user.verificationStatus || 'none'}`}>
                                                {user.verificationStatus === 'verified' && '✓ '}
                                                {user.verificationStatus === 'pending' && '⏳ '}
                                                {user.verificationStatus === 'rejected' && '✗ '}
                                                {(user.verificationStatus || 'none').charAt(0).toUpperCase() +
                                                 (user.verificationStatus || 'none').slice(1)}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                {/* Suspend / Unsuspend */}
                                                {user.isSuspended ? (
                                                    <button
                                                        className="btn-action btn-unsuspend"
                                                        onClick={() => handleSuspend(user._id)}
                                                        disabled={actionLoading === user._id}
                                                    >
                                                        Unsuspend
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btn-action btn-suspend"
                                                        onClick={() => handleSuspend(user._id)}
                                                        disabled={actionLoading === user._id}
                                                    >
                                                        Suspend
                                                    </button>
                                                )}

                                                {/* Verification actions — only for pending users */}
                                                {user.verificationStatus === 'pending' && (
                                                    <>
                                                        <button
                                                            className="btn-action btn-approve"
                                                            onClick={() => handleVerification(user._id, 'approve')}
                                                            disabled={actionLoading === user._id}
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            className="btn-action btn-reject"
                                                            onClick={() => handleVerification(user._id, 'reject')}
                                                            disabled={actionLoading === user._id}
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Bug Fix BUG-H2: Pagination Controls */}
                {pagination.totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1.5rem', padding: '1rem 0' }}>
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page <= 1}
                            style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: page <= 1 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)', color: page <= 1 ? 'rgba(255,255,255,0.3)' : '#fff', cursor: page <= 1 ? 'default' : 'pointer', fontSize: '0.85rem' }}
                        >
                            ← Previous
                        </button>
                        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                            Page {page} of {pagination.totalPages}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                            disabled={page >= pagination.totalPages}
                            style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: page >= pagination.totalPages ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)', color: page >= pagination.totalPages ? 'rgba(255,255,255,0.3)' : '#fff', cursor: page >= pagination.totalPages ? 'default' : 'pointer', fontSize: '0.85rem' }}
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsersPage;
