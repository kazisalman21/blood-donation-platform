import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AvailabilityToggle = ({ donorId, token, isAvailable, nextEligibleDate, onUpdate }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

    const btnClass = isLocked
        ? 'toggle-btn toggle-locked'
        : isAvailable
            ? 'toggle-btn toggle-unavailable'
            : 'toggle-btn toggle-available';

    return (
        <div className="toggle-wrapper">
            <button
                onClick={handleToggle}
                disabled={loading || isLocked}
                className={btnClass}
            >
                {loading
                    ? 'Updating...'
                    : isLocked
                        ? `🔒 Locked — ${daysRemaining} days remaining`
                        : isAvailable
                            ? '🔴 Set as Unavailable'
                            : '🟢 Set as Available'}
            </button>

            {isLocked && (
                <div className="cooldown-notice">
                    ⏳ 56-day cooldown active — eligible on{' '}
                    <strong>{new Date(nextEligibleDate).toLocaleDateString()}</strong>
                </div>
            )}

            {error && (
                <div className="toggle-error">{error}</div>
            )}
        </div>
    );
};

export default AvailabilityToggle;
