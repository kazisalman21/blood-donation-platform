/**
 * RequestHistoryPage — View layer for Feature 12 (Request History & Records)
 * Owner: Miskatul Afrin Anika
 * Controller: communityController.getRequesterHistory()
 * Model: BloodRequest.js
 */
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import '../donor/DonorProfile.css';
import './HistoryFilters.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const STATUSES = ['Open', 'Donors Notified', 'Donor Matched', 'Contact Shared', 'Scheduled', 'Completed'];
const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const RequestHistoryPage = () => {
    const { user, token } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter state
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [bloodTypeFilter, setBloodTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Expandable row state
    const [expandedRow, setExpandedRow] = useState(null);

    const fetchHistory = async (overrideFilters = null) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();

            const effectiveFrom = overrideFilters ? overrideFilters.fromDate : fromDate;
            const effectiveTo = overrideFilters ? overrideFilters.toDate : toDate;
            const effectiveBlood = overrideFilters ? overrideFilters.bloodTypeFilter : bloodTypeFilter;
            const effectiveStatus = overrideFilters ? overrideFilters.statusFilter : statusFilter;

            if (effectiveFrom) params.append('from', effectiveFrom);
            if (effectiveTo) params.append('to', effectiveTo);
            if (effectiveBlood) params.append('bloodType', effectiveBlood);
            if (effectiveStatus) params.append('status', effectiveStatus);

            const res = await axios.get(
                `${API_URL}/community/requesters/${user._id}/history?${params.toString()}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setRequests(res.data);
        } catch (err) {
            console.error('Failed to load request history:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchHistory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, token]);

    const handleApplyFilters = () => {
        fetchHistory();
    };

    const handleClearFilters = () => {
        setFromDate('');
        setToDate('');
        setBloodTypeFilter('');
        setStatusFilter('');
        fetchHistory({ fromDate: '', toDate: '', bloodTypeFilter: '', statusFilter: '' });
    };

    const toggleRow = (index) => {
        setExpandedRow(expandedRow === index ? null : index);
    };

    // Hand-written CSV export — no external library (course requirement)
    const exportCSV = () => {
        const headers = ['Date', 'Blood Type', 'Units', 'Hospital', 'Urgency', 'Status', 'Location'];
        const escapeField = (field) => {
            const str = String(field || '');
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return '"' + str.replace(/"/g, '""') + '"';
            }
            return str;
        };
        const rows = requests.map(r => [
            new Date(r.createdAt).toLocaleDateString(),
            r.bloodType,
            r.unitsNeeded,
            escapeField(r.hospital),
            r.urgency,
            r.status,
            escapeField(r.location)
        ]);
        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'request_history.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    // Render status timeline for expanded row
    const renderTimeline = (request) => {
        const allStages = ['Open', 'Donors Notified', 'Donor Matched', 'Contact Shared', 'Scheduled', 'Completed'];
        const history = request.statusHistory || [];

        // Build a map of stage → timestamp from statusHistory
        const stageMap = {};
        history.forEach(h => {
            stageMap[h.stage] = h.timestamp || h.changedAt;
        });

        const currentIndex = allStages.indexOf(request.status);

        return (
            <div className="status-timeline">
                {allStages.map((stage, i) => {
                    const isCompleted = i < currentIndex;
                    const isCurrent = i === currentIndex;
                    const timestamp = stageMap[stage];

                    return (
                        <div className="timeline-step" key={stage}>
                            <div className="timeline-node">
                                <div className={`timeline-dot ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`} />
                                <span className={`timeline-label ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                                    {stage}
                                </span>
                                {timestamp && (
                                    <span className="timeline-time">
                                        {new Date(timestamp).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                            {i < allStages.length - 1 && (
                                <div className={`timeline-connector ${isCompleted ? 'completed' : ''}`} />
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    if (loading) return <div className="loading-screen">Loading request history...</div>;

    return (
        <div className="profile-page">
            <div className="profile-card" style={{ maxWidth: '900px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h1 style={{ color: '#fff', fontSize: '1.5rem' }}>📋 Request History</h1>
                    <button onClick={exportCSV} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
                        Export CSV ↓
                    </button>
                </div>

                {/* Filter Controls */}
                <div className="history-filters">
                    <div className="filter-row">
                        <div className="filter-group">
                            <label>From Date</label>
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                            />
                        </div>
                        <div className="filter-group">
                            <label>To Date</label>
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                            />
                        </div>
                        <div className="filter-group">
                            <label>Blood Type</label>
                            <select
                                value={bloodTypeFilter}
                                onChange={(e) => setBloodTypeFilter(e.target.value)}
                            >
                                <option value="">All Types</option>
                                {BLOOD_TYPES.map(bt => (
                                    <option key={bt} value={bt}>{bt}</option>
                                ))}
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">All Statuses</option>
                                {STATUSES.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="filter-actions">
                        <button onClick={handleApplyFilters} className="filter-btn filter-btn-apply">
                            🔍 Apply Filters
                        </button>
                        <button onClick={handleClearFilters} className="filter-btn filter-btn-clear">
                            ✕ Clear
                        </button>
                    </div>
                </div>

                {requests.length === 0 ? (
                    <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '3rem' }}>
                        No blood requests found. {fromDate || toDate || bloodTypeFilter || statusFilter ? 'Try adjusting your filters.' : 'Post a request to see your history here.'}
                    </p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <p className="results-count">{requests.length} request{requests.length !== 1 ? 's' : ''} found — click a row to expand details</p>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    <th style={{ padding: '0.8rem', width: '30px' }}></th>
                                    {['Date', 'Blood Type', 'Units', 'Hospital', 'Urgency', 'Status'].map(h => (
                                        <th key={h} style={{ padding: '0.8rem', textAlign: 'left', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textTransform: 'uppercase' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((r, i) => (
                                    <React.Fragment key={i}>
                                        {/* Main Row — Clickable */}
                                        <tr
                                            className="expandable-row"
                                            onClick={() => toggleRow(i)}
                                            style={{ borderBottom: expandedRow === i ? 'none' : '1px solid rgba(255,255,255,0.05)' }}
                                        >
                                            <td style={{ padding: '0.8rem' }}>
                                                <span className={`expand-icon ${expandedRow === i ? 'expanded' : ''}`}>▶</span>
                                            </td>
                                            <td style={{ padding: '0.8rem', color: '#fff' }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                                            <td style={{ padding: '0.8rem' }}><span className="blood-badge" style={{ fontSize: '0.8rem' }}>{r.bloodType}</span></td>
                                            <td style={{ padding: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>{r.unitsNeeded}</td>
                                            <td style={{ padding: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>{r.hospital}</td>
                                            <td style={{ padding: '0.8rem' }}>
                                                <span className={`urgency-badge urgency-${r.urgency}`}>{r.urgency}</span>
                                            </td>
                                            <td style={{ padding: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>{r.status}</td>
                                        </tr>

                                        {/* Expanded Detail Row */}
                                        {expandedRow === i && (
                                            <tr>
                                                <td colSpan="7" style={{ padding: '0 0.8rem 1rem' }}>
                                                    <div className="expanded-detail" style={{
                                                        background: 'rgba(255, 255, 255, 0.02)',
                                                        border: '1px solid rgba(255, 255, 255, 0.06)',
                                                        borderRadius: '10px',
                                                        padding: '1rem 1.2rem'
                                                    }}>
                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '1rem' }}>
                                                            <div>
                                                                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Location</span>
                                                                <p style={{ color: '#fff', margin: '0.2rem 0 0', fontSize: '0.9rem' }}>{r.location || 'N/A'}</p>
                                                            </div>
                                                            <div>
                                                                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Matched Donor</span>
                                                                <p style={{ color: '#fff', margin: '0.2rem 0 0', fontSize: '0.9rem' }}>
                                                                    {r.matchedDonorId ? `Donor #${String(r.matchedDonorId._id || r.matchedDonorId).slice(-6)}` : 'Not yet matched'}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Donor Consent</span>
                                                                <p style={{ color: r.donorConsent ? '#4caf50' : 'rgba(255,255,255,0.5)', margin: '0.2rem 0 0', fontSize: '0.9rem' }}>
                                                                    {r.donorConsent ? '✓ Given' : '✕ Pending'}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Your Consent</span>
                                                                <p style={{ color: r.requesterConsent ? '#4caf50' : 'rgba(255,255,255,0.5)', margin: '0.2rem 0 0', fontSize: '0.9rem' }}>
                                                                    {r.requesterConsent ? '✓ Given' : '✕ Pending'}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Status Timeline */}
                                                        <div>
                                                            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Status Timeline</span>
                                                            {renderTimeline(r)}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RequestHistoryPage;
