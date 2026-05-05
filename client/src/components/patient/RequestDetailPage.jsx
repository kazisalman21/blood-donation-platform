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
    const { user, token } = useAuth();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [contactInfo, setContactInfo] = useState(null);
    const [actionLoading, setActionLoading] = useState('');
    const [actionMsg, setActionMsg] = useState(null);

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
            // Fetch contact info if status is past consent stage
            const statusIndex = STATUS_STAGES.indexOf(res.data.status);
            if (statusIndex >= 3) { // Contact Shared or later
                fetchContactInfo();
            }
        } catch (err) {
            setError('Failed to load request details');
        } finally {
            setLoading(false);
        }
    };

    const fetchContactInfo = async () => {
        try {
            const res = await axios.get(`${API_URL}/requests/${id}/contact`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setContactInfo(res.data);
        } catch (err) {
            console.error('Failed to fetch contact info:', err);
        }
    };

    // Requester gives consent to share contact info
    const handleGiveConsent = async () => {
        setActionLoading('consent');
        setActionMsg(null);
        try {
            const res = await axios.put(`${API_URL}/requests/${id}/consent`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setActionMsg({ type: 'success', text: 'Consent given! Contact info is now shared.' });
            setRequest(res.data.request);
            // Fetch contact info now
            fetchContactInfo();
        } catch (err) {
            setActionMsg({ type: 'error', text: err.response?.data?.message || 'Failed to give consent' });
        } finally {
            setActionLoading('');
            setTimeout(() => setActionMsg(null), 5000);
        }
    };

    // Update request status
    const handleUpdateStatus = async (newStatus) => {
        setActionLoading(newStatus);
        setActionMsg(null);
        try {
            const res = await axios.put(`${API_URL}/requests/${id}/status`, 
                { newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setActionMsg({ type: 'success', text: `Status updated to "${newStatus}"` });
            setRequest(res.data.request);
        } catch (err) {
            setActionMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update status' });
        } finally {
            setActionLoading('');
            setTimeout(() => setActionMsg(null), 5000);
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
    const isRequester = (request.requesterId?._id || request.requesterId) === user?._id;
    const isMatchedDonor = request.matchedDonorId && 
        (request.matchedDonorId._id || request.matchedDonorId) === user?._id;

    // Build a timestamp map from statusHistory
    const timestampMap = {};
    if (request.statusHistory) {
        request.statusHistory.forEach(entry => {
            timestampMap[entry.stage] = entry.timestamp;
        });
    }

    // Determine what the next action should be
    const getNextAction = () => {
        if (!isRequester && !isMatchedDonor) return null;
        
        switch (request.status) {
            case 'Donor Matched':
                if (isRequester && !request.requesterConsent) {
                    return { action: 'consent', label: '🤝 Confirm Donor & Share Contact', description: 'Confirm this donor match to share contact information with each other.' };
                }
                return null;
            case 'Contact Shared':
                return { action: 'status', nextStatus: 'Scheduled', label: '📅 Mark as Scheduled', description: 'Mark this request as scheduled once you\'ve arranged a date.' };
            case 'Scheduled':
                return { action: 'status', nextStatus: 'Completed', label: '✅ Mark as Completed', description: 'Mark as completed after the donation is done.' };
            default:
                return null;
        }
    };

    const nextAction = getNextAction();

    return (
        <div className="request-detail-page">
            <div className="request-detail-container">
                {/* Back button */}
                <button className="back-link" onClick={() => navigate(-1)} id="back-btn">
                    ← Back
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
                            const isCompletedStage = stage === 'Completed' && isCurrent;
                            const stepClass = (isCompleted || isCompletedStage) ? 'completed' : isCurrent ? 'current' : 'pending';

                            return (
                                <div className="status-step" key={stage}>
                                    <div className={`step-circle ${stepClass}`}>
                                        {(isCompleted || isCompletedStage) ? '✓' : STAGE_ICONS[index]}
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

                {/* ===== MATCHED DONOR INFO ===== */}
                {request.matchedDonorId && currentStageIndex >= 2 && (
                    <div className="workflow-section" id="matched-donor-section">
                        <h2>🤝 Matched Donor</h2>
                        <div className="matched-donor-card">
                            <div className="matched-donor-avatar">
                                {(request.matchedDonorId?.name || 'D').charAt(0).toUpperCase()}
                            </div>
                            <div className="matched-donor-info">
                                <h3>
                                    {request.matchedDonorId?.name || `Donor #${(request.matchedDonorId._id || request.matchedDonorId).toString().slice(-6)}`}
                                    {request.matchedDonorId?.isVerified && <span className="verified-badge" title="Verified">✓</span>}
                                </h3>
                                <p>{request.matchedDonorId?.bloodType && `${request.matchedDonorId.bloodType} •`} {request.matchedDonorId?.city || ''}</p>
                            </div>
                            <div className="consent-status-badges">
                                <span className={`consent-badge ${request.donorConsent ? 'given' : 'pending'}`}>
                                    {request.donorConsent ? '✓ Donor Consent' : '⏳ Donor Consent'}
                                </span>
                                <span className={`consent-badge ${request.requesterConsent ? 'given' : 'pending'}`}>
                                    {request.requesterConsent ? '✓ Your Consent' : '⏳ Your Consent'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* ===== CONTACT INFO (after both consents) ===== */}
                {contactInfo && contactInfo.unlocked && (
                    <div className="workflow-section contact-section" id="contact-info-section">
                        <h2>📞 Contact Information</h2>
                        <p className="contact-unlock-msg">✅ Both parties have given consent — contact info is now visible</p>
                        <div className="contact-grid">
                            {contactInfo.donor && (
                                <div className="contact-card">
                                    <div className="contact-card-label">Donor</div>
                                    <div className="contact-card-name">{contactInfo.donor.name}</div>
                                    <div className="contact-card-row">
                                        <span>📧</span> {contactInfo.donor.email}
                                    </div>
                                    <div className="contact-card-row">
                                        <span>📱</span> {contactInfo.donor.phone}
                                    </div>
                                    <div className="contact-card-row">
                                        <span>📍</span> {contactInfo.donor.city}
                                    </div>
                                </div>
                            )}
                            {contactInfo.requester && (
                                <div className="contact-card">
                                    <div className="contact-card-label">Requester</div>
                                    <div className="contact-card-name">{contactInfo.requester.name}</div>
                                    <div className="contact-card-row">
                                        <span>📧</span> {contactInfo.requester.email}
                                    </div>
                                    <div className="contact-card-row">
                                        <span>📱</span> {contactInfo.requester.phone}
                                    </div>
                                    <div className="contact-card-row">
                                        <span>📍</span> {contactInfo.requester.city}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ===== MASKED CONTACT (before consent) ===== */}
                {contactInfo && !contactInfo.unlocked && currentStageIndex >= 2 && (
                    <div className="workflow-section contact-section masked" id="masked-contact-section">
                        <h2>🔒 Contact Information (Locked)</h2>
                        <p className="contact-lock-msg">{contactInfo.message}</p>
                        <div className="contact-grid">
                            {contactInfo.donor && (
                                <div className="contact-card masked">
                                    <div className="contact-card-label">Donor</div>
                                    <div className="contact-card-name">{contactInfo.donor.name}</div>
                                    <div className="contact-card-row masked-text">
                                        <span>📧</span> {contactInfo.donor.email}
                                    </div>
                                    <div className="contact-card-row masked-text">
                                        <span>📱</span> {contactInfo.donor.phone}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ===== ACTION SECTION ===== */}
                {nextAction && (
                    <div className="workflow-section action-section" id="action-section">
                        <h2>⚡ Next Step</h2>
                        <p className="action-description">{nextAction.description}</p>
                        <button
                            className={`workflow-action-btn ${nextAction.action === 'consent' ? 'consent-btn' : 'status-btn'}`}
                            onClick={() => {
                                if (nextAction.action === 'consent') {
                                    handleGiveConsent();
                                } else {
                                    handleUpdateStatus(nextAction.nextStatus);
                                }
                            }}
                            disabled={actionLoading !== ''}
                            id="workflow-action-btn"
                        >
                            {actionLoading ? (
                                <><span className="action-spinner" /> Processing...</>
                            ) : (
                                nextAction.label
                            )}
                        </button>
                        {actionMsg && (
                            <div className={`action-msg ${actionMsg.type}`}>
                                {actionMsg.text}
                            </div>
                        )}
                    </div>
                )}

                {/* Completed message */}
                {request.status === 'Completed' && (
                    <div className="workflow-section completed-section" id="completed-section">
                        <div className="completed-banner">
                            <span className="completed-icon">🎉</span>
                            <h2>Donation Completed!</h2>
                            <p>Thank you for saving a life. The donation has been recorded and the donor's stats have been updated.</p>
                        </div>
                    </div>
                )}

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
