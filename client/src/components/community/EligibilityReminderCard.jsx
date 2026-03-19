/**
 * EligibilityReminderCard — View layer for Feature 14 (Eligibility Reminders)
 * Owner: Miskatul Afrin Anika
 * Model: Donor.js (nextEligibleDate, lastDonationDate)
 * 
 * SRS Requirements:
 * FR-14.3: Display eligibility countdown on donor dashboard
 * Shows "You can donate in X days" or "You're eligible!" based on nextEligibleDate
 * Includes a progress bar showing 56-day cooldown progress
 *
 * Refactored: inline styles → CSS classes (EligibilityReminderCard.css)
 */
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './EligibilityReminderCard.css';

const EligibilityReminderCard = ({ nextEligibleDate: propDate, lastDonationDate }) => {
    const { user } = useAuth();
    const effectiveDate = propDate || user?.nextEligibleDate;

    // Calculate days remaining until eligible
    const calculateEligibility = () => {
        if (!effectiveDate) {
            return { eligible: true, daysLeft: 0, progress: 100 };
        }

        const now = new Date();
        const eligibleDate = new Date(effectiveDate);
        const diffMs = eligibleDate - now;
        const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        if (daysLeft <= 0) {
            return { eligible: true, daysLeft: 0, progress: 100 };
        }

        // 56 days is the standard donation cooldown period
        const COOLDOWN_DAYS = 56;
        const daysPassed = COOLDOWN_DAYS - daysLeft;
        const progress = Math.min(100, Math.max(0, (daysPassed / COOLDOWN_DAYS) * 100));

        return { eligible: false, daysLeft, progress };
    };

    const { eligible, daysLeft, progress } = calculateEligibility();

    // Format the next eligible date for display
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className={`eligibility-card ${eligible ? 'eligible' : 'not-eligible'}`}>
            {/* Header */}
            <div className="eligibility-header">
                <span className="eligibility-icon">
                    {eligible ? '✅' : '⏳'}
                </span>
                <h3 className={`eligibility-title ${eligible ? 'eligible' : 'not-eligible'}`}>
                    Donation Eligibility
                </h3>
            </div>

            {/* Status Message */}
            <p className="eligibility-message">
                {eligible
                    ? "You're eligible to donate blood! Find a request and save a life."
                    : `You can donate again in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}.`
                }
            </p>

            {/* Progress Bar (only show if not yet eligible) */}
            {!eligible && (
                <>
                    <div className="eligibility-progress-track">
                        <div
                            className="eligibility-progress-fill"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="eligibility-date">
                        Eligible on {formatDate(effectiveDate)}
                    </p>
                </>
            )}
        </div>
    );
};

export default EligibilityReminderCard;
