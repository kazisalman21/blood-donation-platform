/**
 * BadgeShowcase — Reusable badge grid for Feature 13 (Donor Leaderboard)
 * Owner: Miskatul Afrin Anika
 * Displays earned badges in color and unearned badges in grayscale
 * No external library — hand-coded badge definitions (SRS FR-13.5)
 */
import React from 'react';

// Badge definitions — hand-coded, no external library (course requirement)
const ALL_BADGES = [
    { id: 'first_donation', label: 'First Donation', icon: '🩸', threshold: 1 },
    { id: '5_donations', label: '5 Donations', icon: '⭐', threshold: 5 },
    { id: '10_donations', label: '10 Donations', icon: '🌟', threshold: 10 },
    { id: '25_donations', label: '25 Donations', icon: '🏅', threshold: 25 },
    { id: '50_donations', label: '50 Donations', icon: '🏆', threshold: 50 },
    { id: '100_donations', label: '100 Donations', icon: '💎', threshold: 100 }
];

const BadgeShowcase = ({ earnedBadges = [], donationCount = 0 }) => {
    return (
        <div className="badge-showcase">
            {ALL_BADGES.map(badge => {
                const isEarned = earnedBadges.includes(badge.id) || donationCount >= badge.threshold;

                return (
                    <div
                        key={badge.id}
                        className={`badge-item ${isEarned ? 'earned' : 'unearned'}`}
                        title={isEarned ? `${badge.label} — Earned!` : `${badge.label} — ${badge.threshold} donations needed`}
                    >
                        <span className="badge-icon">{badge.icon}</span>
                        <span className="badge-label">{badge.label}</span>
                    </div>
                );
            })}
        </div>
    );
};

export { ALL_BADGES };
export default BadgeShowcase;
