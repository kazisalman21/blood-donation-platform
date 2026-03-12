import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './ConsentModal.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * ConsentModal — shown when a donor taps "Accept" on a blood request.
 * Displays request details and asks for explicit confirmation before
 * calling PUT /api/requests/:id/respond with { accept: true }.
 *
 * Props:
 *   requestId   — the blood request _id
 *   requestInfo — { bloodType, hospital, urgency, location } for display
 *   onConfirm   — callback after successful accept
 *   onCancel    — callback to close without action
 */
const ConsentModal = ({ requestId, requestInfo = {}, onConfirm, onCancel }) => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleConfirm = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API}/api/requests/${requestId}/respond`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ accept: true })
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || 'Failed to accept request. Please try again.');
                return;
            }
            if (onConfirm) onConfirm(data.request);
        } catch (err) {
            setError('Network error. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="consent-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
            <div className="consent-modal" role="dialog" aria-modal="true" aria-labelledby="consent-title">
                {/* Header */}
                <div className="consent-modal-header">
                    <span className="consent-modal-icon">🩸</span>
                    <div>
                        <h2 id="consent-title">Confirm Donation Consent</h2>
                        <p>By accepting, you agree to be matched with this patient. Your contact info stays private until both parties consent.</p>
                    </div>
                </div>

                {/* Body */}
                <div className="consent-modal-body">
                    {/* Request details */}
                    <div className="consent-info-box">
                        {requestInfo.bloodType && (
                            <div className="consent-info-row">
                                <strong>Blood Type</strong>
                                <span>{requestInfo.bloodType}</span>
                            </div>
                        )}
                        {requestInfo.hospital && (
                            <div className="consent-info-row">
                                <strong>Hospital</strong>
                                <span>{requestInfo.hospital}</span>
                            </div>
                        )}
                        {requestInfo.location && (
                            <div className="consent-info-row">
                                <strong>Location</strong>
                                <span>{requestInfo.location}</span>
                            </div>
                        )}
                        {requestInfo.urgency && (
                            <div className="consent-info-row">
                                <strong>Urgency</strong>
                                <span className={`consent-urgency-badge ${requestInfo.urgency}`}>
                                    {requestInfo.urgency}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Privacy note */}
                    <div className="consent-privacy-note">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        Your phone and email are masked until the requester also confirms consent. Only then will contact details be shared to both parties.
                    </div>

                    {error && (
                        <p style={{ color: 'var(--accent)', fontSize: '0.82rem', marginTop: '0.75rem' }}>
                            ⚠ {error}
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div className="consent-modal-footer">
                    <button className="consent-btn-cancel" onClick={onCancel} disabled={loading}>
                        Cancel
                    </button>
                    <button className="consent-btn-confirm" onClick={handleConfirm} disabled={loading}>
                        {loading ? 'Confirming...' : '✓ Yes, I Consent'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConsentModal;
