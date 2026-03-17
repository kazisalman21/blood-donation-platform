/**
 * EligibilityReminderCard — View layer for Feature 14 (Eligibility Reminders)
 * Owner: Miskatul Afrin Anika
 * Model: Donor.js (nextEligibleDate, lastDonationDate)
 * 
 * SRS Requirements:
 * FR-14.3: Display eligibility countdown on donor dashboard
 * Shows "You can donate in X days" or "You're eligible!" based on nextEligibleDate
 * Includes a progress bar showing 56-day cooldown progress
 */
import React from 'react';
import { useAuth } from '../../context/AuthContext';

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
        <div style={{
            background: eligible
                ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.12), rgba(76, 175, 80, 0.04))'
                : 'linear-gradient(135deg, rgba(239, 83, 80, 0.12), rgba(239, 83, 80, 0.04))',
            border: `1px solid ${eligible ? 'rgba(76, 175, 80, 0.25)' : 'rgba(239, 83, 80, 0.2)'}`,
            borderRadius: '14px',
            padding: '1.3rem',
            marginBottom: '1rem'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                marginBottom: '0.8rem'
            }}>
                <span style={{ fontSize: '1.3rem' }}>
                    {eligible ? '✅' : '⏳'}
                </span>
                <h3 style={{
                    color: eligible ? '#4caf50' : '#ef5350',
                    fontSize: '1rem',
                    fontWeight: 600,
                    margin: 0
                }}>
                    Donation Eligibility
                </h3>
            </div>

            {/* Status Message */}
            <p style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.95rem',
                margin: '0 0 1rem 0'
            }}>
                {eligible
                    ? "You're eligible to donate blood! Find a request and save a life."
                    : `You can donate again in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}.`
                }
            </p>

            {/* Progress Bar (only show if not yet eligible) */}
            {!eligible && (
                <>
                    <div style={{
                        width: '100%',
                        height: '6px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '3px',
                        overflow: 'hidden',
                        marginBottom: '0.5rem'
                    }}>
                        <div style={{
                            width: `${progress}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #ef5350, #ff8a65)',
                            borderRadius: '3px',
                            transition: 'width 0.5s ease'
                        }} />
                    </div>
                    <p style={{
                        color: 'rgba(255, 255, 255, 0.4)',
                        fontSize: '0.75rem',
                        margin: 0,
                        textAlign: 'right'
                    }}>
                        Eligible on {formatDate(effectiveDate)}
                    </p>
                </>
            )}
        </div>
    );
};

export default EligibilityReminderCard;
