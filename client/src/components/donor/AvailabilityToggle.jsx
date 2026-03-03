import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AvailabilityToggle = ({ donorId, token, isAvailable, nextEligibleDate, onUpdate }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Calculate days remaining for cooldown
    const getDaysRemaining = () => {
        if (!nextEligibleDate) return 0;
        const diff = new Date(nextEligibleDate) - new Date();
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    };

    const daysRemaining = getDaysRemaining();
    const isLocked = !isAvailable && nextEligibleDate && daysRemaining > 0;

    const handleToggle = async () => {
        setLoading(true);
        setError('');

        try {
            const res = await axios.put(
                `${API_URL}/donors/${donorId}/availability`,
                { isAvailable: !isAvailable },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onUpdate(res.data.isAvailable, res.data.nextEligibleDate);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update availability');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ marginTop: '0.5rem' }}>
            {/* Toggle Button */}
            <button
                onClick={handleToggle}
                disabled={loading || isLocked}
                style={{
                    width: '100%',
                    padding: '0.85rem',
                    borderRadius: '10px',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    cursor: isLocked ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    background: isLocked
                        ? 'rgba(255, 255, 255, 0.06)'
                        : isAvailable
                            ? 'rgba(239, 83, 80, 0.2)'
                            : 'rgba(76, 175, 80, 0.2)',
                    color: isLocked
                        ? 'rgba(255, 255, 255, 0.3)'
                        : isAvailable
                            ? '#ef5350'
                            : '#4caf50',
                    border: `1px solid ${isLocked
                        ? 'rgba(255, 255, 255, 0.08)'
                        : isAvailable
                            ? 'rgba(239, 83, 80, 0.3)'
                            : 'rgba(76, 175, 80, 0.3)'}`,
                }}
            >
                {loading
                    ? 'Updating...'
                    : isLocked
                        ? `🔒 Locked — ${daysRemaining} days remaining`
                        : isAvailable
                            ? '🔴 Set as Unavailable'
                            : '🟢 Set as Available'}
            </button>

            {/* Cooldown countdown */}
            {isLocked && (
                <div style={{
                    marginTop: '0.6rem',
                    padding: '0.7rem',
                    background: 'rgba(255, 152, 0, 0.1)',
                    border: '1px solid rgba(255, 152, 0, 0.25)',
                    borderRadius: '8px',
                    color: '#ff9800',
                    fontSize: '0.8rem',
                    textAlign: 'center'
                }}>
                    ⏳ 56-day cooldown active — eligible on{' '}
                    <strong>{new Date(nextEligibleDate).toLocaleDateString()}</strong>
                </div>
            )}

            {/* Error message */}
            {error && (
                <div style={{
                    marginTop: '0.6rem',
                    padding: '0.6rem',
                    background: 'rgba(239, 83, 80, 0.15)',
                    border: '1px solid rgba(239, 83, 80, 0.3)',
                    borderRadius: '8px',
                    color: '#ef5350',
                    fontSize: '0.8rem',
                    textAlign: 'center'
                }}>
                    {error}
                </div>
            )}
        </div>
    );
};

export default AvailabilityToggle;
