/**
 * GlobalRequestsPage — Browse all blood requests and offer to donate
 * Owner: Kazi Salman Salim (23101209)
 * Controller: requestController.getRequests(), respondToRequest()
 * 
 * Shows all active blood requests with filters. Donors can click
 * "Offer to Donate" to accept a request directly from this page.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './GlobalRequests.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Hand-written relative time formatter — no external library (course requirement).
 */
const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
    return date.toLocaleDateString();
};

const BLOOD_TYPES = ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const URGENCIES = ['', 'Critical', 'Urgent', 'Normal'];
const STATUSES = ['', 'Open', 'Donors Notified', 'Donor Matched', 'Contact Shared', 'Scheduled', 'Completed'];

const GlobalRequestsPage = () => {
    const { user, token } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
    const [respondingTo, setRespondingTo] = useState(null);
    const [responseMsg, setResponseMsg] = useState(null);

    // Filters
    const [bloodType, setBloodType] = useState('');
    const [urgency, setUrgency] = useState('');
    const [status, setStatus] = useState('');
    const [city, setCity] = useState('');
    const [page, setPage] = useState(1);

    const fetchRequests = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, limit: 12 };
            if (bloodType) params.bloodType = bloodType;
            if (urgency) params.urgency = urgency;
            if (status) params.status = status;
            if (city) params.city = city;

            const res = await axios.get(`${API_URL}/requests`, {
                headers: { Authorization: `Bearer ${token}` },
                params
            });

            setRequests(res.data.data || res.data);
            if (res.data.pagination) {
                setPagination(res.data.pagination);
            }
        } catch (err) {
            console.error('Failed to fetch requests:', err);
        } finally {
            setLoading(false);
        }
    }, [token, page, bloodType, urgency, status, city]);

    useEffect(() => {
        if (token) fetchRequests();
    }, [fetchRequests, token]);

    // Reset to page 1 on filter change
    useEffect(() => {
        setPage(1);
    }, [bloodType, urgency, status, city]);

    const handleOfferToDonate = async (requestId) => {
        setRespondingTo(requestId);
        setResponseMsg(null);
        try {
            await axios.put(`${API_URL}/requests/${requestId}/respond`,
                { accept: true },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setResponseMsg({ id: requestId, type: 'success', text: 'You\'ve been matched! Check your notifications.' });
            // Refresh list
            fetchRequests();
        } catch (err) {
            const errMsg = err.response?.data?.message || 'Failed to respond';
            setResponseMsg({ id: requestId, type: 'error', text: errMsg });
        } finally {
            setRespondingTo(null);
            setTimeout(() => setResponseMsg(null), 5000);
        }
    };

    const clearFilters = () => {
        setBloodType('');
        setUrgency('');
        setStatus('');
        setCity('');
        setPage(1);
    };

    const hasFilters = bloodType || urgency || status || city;

    const getUrgencyClass = (urg) => {
        if (urg === 'Critical') return 'critical';
        if (urg === 'Urgent') return 'urgent';
        return 'normal';
    };

    const isOwnRequest = (req) => {
        const reqId = req.requesterId?._id || req.requesterId;
        return reqId === user?._id;
    };

    const isAlreadyMatched = (req) => {
        return req.matchedDonorId != null;
    };

    const canOffer = (req) => {
        return !isOwnRequest(req) && !isAlreadyMatched(req) && 
               ['Open', 'Donors Notified'].includes(req.status);
    };

    return (
        <div className="global-requests-page">
            <div className="global-requests-container">
                {/* Header */}
                <div className="gr-header">
                    <div className="gr-header-left">
                        <h1>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            All Blood Requests
                        </h1>
                        <p>Browse active requests and offer to donate blood</p>
                    </div>
                    <div className="gr-header-stats">
                        <div className="gr-stat">
                            <span className="gr-stat-num">{pagination.total}</span>
                            <span className="gr-stat-label">Total Requests</span>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="gr-filters" id="global-filters">
                    <div className="gr-filter-row">
                        <div className="gr-filter-group">
                            <label>Blood Type</label>
                            <select value={bloodType} onChange={(e) => setBloodType(e.target.value)} id="filter-blood-type">
                                <option value="">All Types</option>
                                {BLOOD_TYPES.filter(Boolean).map(bt => (
                                    <option key={bt} value={bt}>{bt}</option>
                                ))}
                            </select>
                        </div>
                        <div className="gr-filter-group">
                            <label>Urgency</label>
                            <select value={urgency} onChange={(e) => setUrgency(e.target.value)} id="filter-urgency">
                                <option value="">All Levels</option>
                                {URGENCIES.filter(Boolean).map(u => (
                                    <option key={u} value={u}>{u}</option>
                                ))}
                            </select>
                        </div>
                        <div className="gr-filter-group">
                            <label>Status</label>
                            <select value={status} onChange={(e) => setStatus(e.target.value)} id="filter-status">
                                <option value="">All Statuses</option>
                                {STATUSES.filter(Boolean).map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                        <div className="gr-filter-group">
                            <label>City</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Dhaka" 
                                value={city} 
                                onChange={(e) => setCity(e.target.value)}
                                id="filter-city"
                            />
                        </div>
                        {hasFilters && (
                            <button className="gr-clear-btn" onClick={clearFilters}>
                                ✕ Clear
                            </button>
                        )}
                    </div>
                </div>

                {/* Request Grid */}
                {loading ? (
                    <div className="gr-loading">
                        <div className="gr-spinner" />
                        <p>Loading requests...</p>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="gr-empty">
                        <span className="gr-empty-icon">🔍</span>
                        <h3>No Requests Found</h3>
                        <p>{hasFilters ? 'Try adjusting your filters' : 'There are no active blood requests at the moment'}</p>
                    </div>
                ) : (
                    <>
                        <div className="gr-grid" id="requests-grid">
                            {requests.map(req => (
                                <div className={`gr-card urgency-${getUrgencyClass(req.urgency)}`} key={req._id} id={`gr-card-${req._id}`}>
                                    {/* Urgency stripe */}
                                    <div className="gr-card-stripe" />
                                    
                                    {/* Card header */}
                                    <div className="gr-card-header">
                                        <div className="gr-blood-badge">{req.bloodType}</div>
                                        <div className="gr-card-badges">
                                            <span className={`gr-urgency-tag ${getUrgencyClass(req.urgency)}`}>
                                                <span className="gr-pulse-dot" />
                                                {req.urgency}
                                            </span>
                                            <span className={`gr-status-tag status-${req.status?.replace(/\s/g, '-')}`}>
                                                {req.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card body */}
                                    <div className="gr-card-body">
                                        <h3 className="gr-hospital">🏥 {req.hospital}</h3>
                                        <div className="gr-card-details">
                                            <span>📍 {req.location}</span>
                                            <span>📦 {req.unitsNeeded} unit{req.unitsNeeded > 1 ? 's' : ''}</span>
                                            <span>🕐 {getTimeAgo(req.createdAt)}</span>
                                        </div>
                                        {req.additionalNotes && (
                                            <p className="gr-notes">"{req.additionalNotes}"</p>
                                        )}
                                    </div>

                                    {/* Card footer */}
                                    <div className="gr-card-footer">
                                        {isOwnRequest(req) ? (
                                            <span className="gr-own-tag">Your Request</span>
                                        ) : isAlreadyMatched(req) ? (
                                            <span className="gr-matched-tag">✓ Donor Matched</span>
                                        ) : canOffer(req) ? (
                                            <button 
                                                className="gr-offer-btn"
                                                onClick={() => handleOfferToDonate(req._id)}
                                                disabled={respondingTo === req._id}
                                                id={`offer-btn-${req._id}`}
                                            >
                                                {respondingTo === req._id ? (
                                                    <><span className="gr-btn-spinner" /> Processing...</>
                                                ) : (
                                                    <>🩸 Offer to Donate</>
                                                )}
                                            </button>
                                        ) : (
                                            <span className="gr-status-info">{req.status}</span>
                                        )}
                                        
                                        {/* Response message */}
                                        {responseMsg && responseMsg.id === req._id && (
                                            <div className={`gr-response-msg ${responseMsg.type}`}>
                                                {responseMsg.text}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="gr-pagination" id="pagination">
                                <button 
                                    className="gr-page-btn"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    ← Prev
                                </button>
                                <span className="gr-page-info">
                                    Page {page} of {pagination.totalPages}
                                </span>
                                <button 
                                    className="gr-page-btn"
                                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                    disabled={page === pagination.totalPages}
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default GlobalRequestsPage;
