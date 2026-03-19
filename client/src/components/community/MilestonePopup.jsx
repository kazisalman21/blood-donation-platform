/**
 * MilestonePopup — Animated popup for Feature 13 (Donor Leaderboard)
 * Owner: Miskatul Afrin Anika
 * Shows animated congratulations when a new badge is earned (SRS FR-13.6)
 * Auto-dismisses after 3 seconds or on click
 */
import React, { useEffect } from 'react';

const MilestonePopup = ({ badge, onClose }) => {
    // Auto-dismiss after 5 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    if (!badge) return null;

    return (
        <div className="milestone-overlay" onClick={onClose}>
            <div className="milestone-card" onClick={(e) => e.stopPropagation()}>
                <div className="milestone-icon">{badge.icon}</div>
                <h2 className="milestone-title">🎉 New Badge Earned!</h2>
                <p className="milestone-message">
                    Congratulations! You've earned the <strong>{badge.label}</strong> badge
                    for reaching {badge.threshold} donation{badge.threshold !== 1 ? 's' : ''}.
                </p>
                <button className="milestone-close" onClick={onClose}>
                    Awesome!
                </button>
            </div>
        </div>
    );
};

export default MilestonePopup;
