import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './StatusTrackerPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const STATUS_STAGES = ['Open', 'Donors Notified', 'Donor Matched', 'Contact Shared', 'Scheduled', 'Completed'];
const STAGE_ICONS  = ['📝', '📢', '🤝', '📞', '📅', '✅'];

/**
 * Hand-written date formatter — no external library (course requirement).
 */
const formatDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const hr = d.getHours().toString().padStart(2,'0');
    const mn = d.getMinutes().toString().padStart(2,'0');
    return `${months[d.getMonth()]} ${d.getDate()}, ${hr}:${mn}`;
};

const StatusTrackerPage = () => {
    const [requests, setRequests] = useState([]);
    const [selectedId, setSelectedId] = useState('');
    const [selectedReq, setSelectedReq] = useState(null);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchRequests();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await axios.get(`${API_URL}/requests/my`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequests(res.data);
            if (res.data.length > 0) {
                setSelectedId(res.data[0]._id);
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedId) fetchRequestDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedId]);

    const fetchRequestDetail = async () => {
        try {
            const res = await axios.get(`${API_URL}/requests/${selectedId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSelectedReq(res.data);
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const currentIndex = selectedReq ? STATUS_STAGES.indexOf(selectedReq.status) : -1;

    // Build timestamp map from statusHistory
    const tsMap = {};
    if (selectedReq?.statusHistory) {
        selectedReq.statusHistory.forEach(e => { tsMap[e.stage] = e.timestamp; });
    }

    if (loading) {
        return (
            <div className="status-tracker-page">
                <div className="tracker-container">
                    <div className="map-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading your requests...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="status-tracker-page">
            <div className="tracker-container">
                <div className="tracker-header">
                    <h1>📊 Request Status Tracker</h1>
                    <p>Track the real-time progress of your blood requests through the 6-stage pipeline</p>
                </div>

                {requests.length === 0 ? (
                    <div className="map-empty" style={{height: '300px'}}>
                        <span className="map-empty-icon">📭</span>
                        <p>No requests found. Post an emergency request first.</p>
                    </div>
                ) : (
                    <>
                        {/* Request selector */}
                        <select className="tracker-request-select" value={selectedId}
                            onChange={(e) => setSelectedId(e.target.value)} id="request-select">
                            {requests.map(r => (
                                <option key={r._id} value={r._id}>
                                    {r.bloodType} — {r.hospital} ({r.status})
                                </option>
                            ))}
                        </select>

                        {selectedReq && (
                            <>
                                {/* Pipeline visualization */}
                                <div className="pipeline-card" id="pipeline-card">
                                    <h2 className="pipeline-title">🔄 Status Pipeline</h2>
                                    <div className="pipeline-steps">
                                        {STATUS_STAGES.map((stage, idx) => {
                                            const isDone = idx < currentIndex;
                                            const isActive = idx === currentIndex;
                                            const nodeClass = isDone ? 'done' : isActive ? 'active' : 'pending';

                                            return (
                                                <div className="pipeline-step" key={stage}>
                                                    {idx > 0 && idx <= currentIndex && (
                                                        <div className={`step-connector ${isDone ? 'done' : 'active'}`} />
                                                    )}
                                                    <div className={`step-node ${nodeClass}`}>
                                                        {isDone ? '✓' : STAGE_ICONS[idx]}
                                                    </div>
                                                    <span className={`step-name ${(isDone || isActive) ? 'highlight' : ''}`}>
                                                        {stage}
                                                    </span>
                                                    {tsMap[stage] && (
                                                        <span className="step-timestamp">{formatDate(tsMap[stage])}</span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Info grid */}
                                <div className="tracker-info-grid">
                                    <div className="tracker-info-card">
                                        <div className="tracker-info-label">Blood Type</div>
                                        <div className="tracker-info-value">{selectedReq.bloodType}</div>
                                    </div>
                                    <div className="tracker-info-card">
                                        <div className="tracker-info-label">Hospital</div>
                                        <div className="tracker-info-value">{selectedReq.hospital}</div>
                                    </div>
                                    <div className="tracker-info-card">
                                        <div className="tracker-info-label">Units Needed</div>
                                        <div className="tracker-info-value">{selectedReq.unitsNeeded}</div>
                                    </div>
                                    <div className="tracker-info-card">
                                        <div className="tracker-info-label">Urgency</div>
                                        <div className="tracker-info-value" style={{
                                            color: selectedReq.urgency === 'Critical' ? '#f87171'
                                                : selectedReq.urgency === 'Urgent' ? '#fbbf24' : '#34d399'
                                        }}>{selectedReq.urgency}</div>
                                    </div>
                                    <div className="tracker-info-card">
                                        <div className="tracker-info-label">Current Status</div>
                                        <div className="tracker-info-value">{selectedReq.status}</div>
                                    </div>
                                    <div className="tracker-info-card">
                                        <div className="tracker-info-label">Compatible Donors</div>
                                        <div className="tracker-info-value">{selectedReq.compatibleDonorsCount || 0}</div>
                                    </div>
                                    <div className="tracker-info-card">
                                        <div className="tracker-info-label">Patient Name</div>
                                        <div className="tracker-info-value">{selectedReq.patientName || '—'}</div>
                                    </div>
                                    <div className="tracker-info-card">
                                        <div className="tracker-info-label">Location</div>
                                        <div className="tracker-info-value">📍 {selectedReq.location}</div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="tracker-actions">
                                    <button className="tracker-btn tracker-btn-primary"
                                        onClick={() => navigate(`/requests/${selectedReq._id}`)}
                                        id="view-detail-btn">
                                        View Full Details
                                    </button>
                                    <button className="tracker-btn tracker-btn-secondary"
                                        onClick={() => navigate('/requests/my')}
                                        id="all-requests-btn">
                                        All My Requests
                                    </button>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default StatusTrackerPage;
