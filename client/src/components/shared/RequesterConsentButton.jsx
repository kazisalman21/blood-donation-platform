import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './ConsentModal.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * RequesterConsentButton — shown on the requester's dashboard once a donor
 * has accepted (donorConsent === true). Calls PUT /api/requests/:id/consent
 * to give requester-side consent, which completes the dual-consent flow.
 *
 * Props:
 *   requestId      — the blood request _id
 *   donorConsent   — boolean: has the donor already consented?
 *   requesterConsent — boolean: has requester already consented?
 *   onConsented    — callback after successful consent
 */
const RequesterConsentButton = ({ requestId, donorConsent, requesterConsent, onConsented }) => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!donorConsent) return null; // donor hasn't responded yet

    if (requesterConsent) {
        return (
            <div className="consent-status-row">
                <span className="consent-status-badge given">✓ Your consent given</span>
                <span className="consent-status-badge given">✓ Donor consented</span>
            </div>
        );
    }

    const handleConsent = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API}/api/requests/${requestId}/consent`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || 'Failed to give consent.');
                return;
            }
            if (onConsented) onConsented(data.request);
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="consent-status-row">
                <span className="consent-status-badge given">✓ Donor consented</span>
                <span className="consent-status-badge pending">⏳ Your consent pending</span>
            </div>
            <button
                className="consent-requester-btn"
                onClick={handleConsent}
                disabled={loading}
            >
                🤝 {loading ? 'Confirming...' : 'Confirm & Share Contact'}
            </button>
            {error && (
                <p style={{ color: 'var(--accent)', fontSize: '0.8rem', marginTop: '0.4rem' }}>
                    ⚠ {error}
                </p>
            )}
        </div>
    );
};

export default RequesterConsentButton;
