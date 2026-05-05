import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import RequestCard from './RequestCard';
import './MyRequestsPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const MyRequestsPage = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [urgencyFilter, setUrgencyFilter] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const { token } = useAuth();

    useEffect(() => {
        setPage(1);
    }, [statusFilter, urgencyFilter]);

    useEffect(() => {
        fetchMyRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter, urgencyFilter, page]);

    const fetchMyRequests = async () => {
        setLoading(true);
        try {
            const params = { page, limit: 20 };
            if (statusFilter) params.status = statusFilter;
            if (urgencyFilter) params.urgency = urgencyFilter;

            const res = await axios.get(`${API_URL}/requests/my`, {
                headers: { Authorization: `Bearer ${token}` },
                params
            });
            // Bug Fix BUG-NEW-H2: handle paginated response
            setRequests(res.data.data || res.data);
            setPagination(res.data.pagination || null);
        } catch (err) {
            console.error('Error fetching requests:', err);
        } finally {
            setLoading(false);
        }
    };

    // Hand-written stats calculation — no library
    const stats = {
        total: requests.length,
        open: requests.filter(r => r.status === 'Open' || r.status === 'Donors Notified').length,
        matched: requests.filter(r => r.status === 'Donor Matched' || r.status === 'Contact Shared' || r.status === 'Scheduled').length,
        completed: requests.filter(r => r.status === 'Completed').length
    };

    return (
        <div className="my-requests-page">
            <div className="my-requests-container">
                {/* Header */}
                <div className="my-requests-header">
                    <div className="my-requests-title-section">
                        <h1>📋 My Blood Requests</h1>
                        <p>Track and manage all your emergency blood requests</p>
                    </div>
                    <Link to="/request/new" className="new-request-btn" id="new-request-btn">
                        🚨 Post New Request
                    </Link>
                </div>

                {/* Stats bar */}
                {!loading && requests.length > 0 && (
                    <div className="requests-stats">
                        <div className="stat-pill">
                            Total: <strong>{stats.total}</strong>
                        </div>
                        <div className="stat-pill">
                            🟣 Open: <strong>{stats.open}</strong>
                        </div>
                        <div className="stat-pill">
                            🔵 In Progress: <strong>{stats.matched}</strong>
                        </div>
                        <div className="stat-pill">
                            🟢 Completed: <strong>{stats.completed}</strong>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="my-requests-filters">
                    <select
                        className="filter-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        id="filter-status"
                    >
                        <option value="">All Statuses</option>
                        <option value="Open">Open</option>
                        <option value="Donors Notified">Donors Notified</option>
                        <option value="Donor Matched">Donor Matched</option>
                        <option value="Contact Shared">Contact Shared</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Completed">Completed</option>
                    </select>

                    <select
                        className="filter-select"
                        value={urgencyFilter}
                        onChange={(e) => setUrgencyFilter(e.target.value)}
                        id="filter-urgency"
                    >
                        <option value="">All Urgencies</option>
                        <option value="Critical">🔴 Critical</option>
                        <option value="Urgent">🟡 Urgent</option>
                        <option value="Normal">🟢 Normal</option>
                    </select>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="requests-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading your requests...</p>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="requests-empty">
                        <span className="empty-icon">📭</span>
                        <h3>No Requests Found</h3>
                        <p>
                            {statusFilter || urgencyFilter
                                ? 'No requests match your current filters. Try removing a filter.'
                                : 'You haven\'t posted any blood requests yet. Post one to find matching donors.'}
                        </p>
                        {!statusFilter && !urgencyFilter && (
                            <Link to="/request/new" className="new-request-btn" id="empty-new-request-btn">
                                🚨 Post Your First Request
                            </Link>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="requests-grid">
                            {requests.map(request => (
                                <RequestCard key={request._id} request={request} />
                            ))}
                        </div>
                        {/* Bug Fix BUG-NEW-H2: pagination controls */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', gap: '10px', margin: '24px 0' }}>
                                <button
                                    className="btn btn-secondary"
                                    disabled={page <= 1}
                                    onClick={() => setPage(p => p - 1)}
                                >← Prev</button>
                                <span style={{ color: 'rgba(255,255,255,0.7)', alignSelf: 'center' }}>
                                    Page {pagination.page} of {pagination.totalPages}
                                </span>
                                <button
                                    className="btn btn-secondary"
                                    disabled={page >= pagination.totalPages}
                                    onClick={() => setPage(p => p + 1)}
                                >Next →</button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default MyRequestsPage;
