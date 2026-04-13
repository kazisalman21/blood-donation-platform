import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import CompatibilityResults from './CompatibilityResults';
import './RequestDetailPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Hand-written date formatter — no external library (course requirement).
 */
const formatDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
};

/**
 * Hand-written relative time formatter — no external library.
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
    return formatDate(dateString);
};

// The 6-stage status pipeline
const STATUS_STAGES = ['Open', 'Donors Notified', 'Donor Matched', 'Contact Shared', 'Scheduled', 'Completed'];
const STAGE_ICONS = ['📝', '📢', '🤝', '📞', '📅', '✅'];

const RequestDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchRequest = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/requests/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequest(res.data);
        } catch (err) {
            setError('Failed to load request details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="request-detail-page">
                <div className="request-detail-container">
                    <div className="detail-loading">
                        <div className="loading-spinner"></div>
                        <p style={{ color: 'rgba(255,255,255,0.45)' }}>Loading request details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !request) {
        return (
            <div className="request-detail-page">
                <div className="request-detail-container">
                    <div className="detail-error">
                        <p>{error || 'Request not found'}</p>
                        <button className="back-link" onClick={() => navigate('/requests/my')}>← Back to My Requests</button>
                    </div>
                </div>
            </div>
        );
    }

    const currentStageIndex = STATUS_STAGES.indexOf(request.status);

    // Build a timestamp map from statusHistory
    const timestampMap = {};
    if (request.statusHistory) {
        request.statusHistory.forEach(entry => {
            timestampMap[entry.stage] = entry.timestamp;
        });
    }

    return (
        <div className="request-detail-page">
            <div className="request-detail-container">
                {/* Back button */}
                <button className="back-link" onClick={() => navigate('/requests/my')} id="back-btn">
                    ← Back to My Requests
                </button>

                {/* Request Header */}
                <div className={`request-detail-header urgency-${request.urgency}`} id="request-header">
                    <div className="header-top">
                        <div className="header-left">
                            <div className="detail-blood-badge">{request.bloodType}</div>
                            <div className="header-info">
                                <h1>Emergency Blood Request</h1>
                                <p className="hospital-name">🏥 {request.hospital}</p>
                                <p className="request-meta">
                                    Posted {getTimeAgo(request.createdAt)} • Request ID: {request._id?.slice(-8)}
                                </p>
                            </div>
                        </div>
                        <div className="header-badges">
                            <span className={`badge badge-urgency-${request.urgency}`}>
                                <span className="badge-dot"></span>
                                {request.urgency}
                            </span>
                            <span className={`badge badge-status status-${request.status?.replace(/\s/g, '-')}`}>
                                {request.status}
                            </span>
                        </div>
                    </div>

                    {/* Detail Grid */}
                    <div className="detail-grid">
                        <div className="detail-card">
                            <div className="detail-card-label">Patient Name</div>
                            <div className="detail-card-value">{request.patientName || 'Not specified'}</div>
                        </div>
                        <div className="detail-card">
                            <div className="detail-card-label">Blood Type</div>
                            <div className="detail-card-value">{request.bloodType}</div>
                        </div>
                        <div className="detail-card">
                            <div className="detail-card-label">Units Needed</div>
                            <div className="detail-card-value">{request.unitsNeeded} unit{request.unitsNeeded > 1 ? 's' : ''}</div>
                        </div>
                        <div className="detail-card">
                            <div className="detail-card-label">Location</div>
                            <div className="detail-card-value">📍 {request.location}</div>
                        </div>
                        <div className="detail-card">
                            <div className="detail-card-label">Contact</div>
                            <div className="detail-card-value">{request.contactNumber || 'N/A'}</div>
                        </div>
                        <div className="detail-card">
                            <div className="detail-card-label">Urgency</div>
                            <div className={`detail-card-value urgency-${request.urgency}`}>{request.urgency}</div>
                        </div>
                        <div className="detail-card">
                            <div className="detail-card-label">Donors Matched</div>
                            <div className="detail-card-value">{request.compatibleDonorsCount || 0}</div>
                        </div>
                        <div className="detail-card">
                            <div className="detail-card-label">Posted On</div>
                            <div className="detail-card-value">{formatDate(request.createdAt)}</div>
                        </div>
                    </div>

                    {/* Notes */}
                    {request.additionalNotes && (
                        <div className="request-notes">
                            <h3>📝 Additional Notes</h3>
                            <p>{request.additionalNotes}</p>
                        </div>
                    )}
                </div>

                {/* Status Timeline */}
                <div className="status-timeline-section" id="status-timeline">
                    <h2>📊 Request Status Timeline</h2>
                    <div className="status-steps">
                        {STATUS_STAGES.map((stage, index) => {
                            const isCompleted = index < currentStageIndex;
                            const isCurrent = index === currentStageIndex;
                            const stepClass = isCompleted ? 'completed' : isCurrent ? 'current' : 'pending';

                            return (
                                <div className="status-step" key={stage}>
                                    <div className={`step-circle ${stepClass}`}>
                                        {isCompleted ? '✓' : STAGE_ICONS[index]}
                                    </div>
                                    <span className={`step-label ${(isCompleted || isCurrent) ? 'active' : ''}`}>
                                        {stage}
                                    </span>
                                    {timestampMap[stage] && (
                                        <span className="step-time">
                                            {getTimeAgo(timestampMap[stage])}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Compatibility Results — F9 Feature */}
                <CompatibilityResults
                    requestId={request._id}
                    neededBloodType={request.bloodType}
                />
            </div>
        </div>
    );
};

export default RequestDetailPage;
