/**
 * HealthTipsSection — View layer for Feature 14 (Eligibility Reminders)
 * Owner: Miskatul Afrin Anika
 * 
 * SRS Requirements:
 * FR-14.4: Display rotating health tips (stored as static array, rotated by day index)
 * No external library — hand-coded rotation algorithm (course requirement)
 */
import React from 'react';

// Static health tips array — rotated daily by day-of-year index
const HEALTH_TIPS = [
    {
        icon: '💧',
        title: 'Stay Hydrated',
        text: 'Drink at least 16 oz of water before donating blood. Proper hydration helps maintain blood volume and makes the donation process smoother.'
    },
    {
        icon: '🥗',
        title: 'Eat Iron-Rich Foods',
        text: 'Include spinach, red meat, lentils, and beans in your diet. Iron helps your body regenerate red blood cells faster after donation.'
    },
    {
        icon: '😴',
        title: 'Get Enough Sleep',
        text: 'Aim for 7-8 hours of sleep the night before donating. A well-rested body recovers more efficiently from blood donation.'
    },
    {
        icon: '🚫',
        title: 'Avoid Caffeine',
        text: 'Skip coffee and caffeinated drinks on donation day. Caffeine is a diuretic that can dehydrate you and affect blood pressure readings.'
    },
    {
        icon: '🏋️',
        title: 'Light Exercise Only',
        text: 'Avoid heavy exercise for 24 hours after donating. Light walking is fine, but save intense workouts for the next day.'
    },
    {
        icon: '🍌',
        title: 'Potassium Matters',
        text: 'Eat bananas, potatoes, or yogurt before donating. Potassium helps prevent dizziness and muscle cramps during and after donation.'
    },
    {
        icon: '🩺',
        title: 'Know Your Vitals',
        text: 'Check your hemoglobin and blood pressure regularly. Maintaining healthy levels ensures you remain eligible to donate and stay healthy.'
    },
    {
        icon: '🧊',
        title: 'Post-Donation Care',
        text: 'Apply pressure to the needle site for 5 minutes after donating. Keep the bandage on for at least 4 hours to prevent bruising.'
    },
    {
        icon: '⏰',
        title: '56-Day Rule',
        text: 'Wait at least 56 days (8 weeks) between whole blood donations. This gives your body enough time to fully regenerate red blood cells.'
    },
    {
        icon: '🫀',
        title: 'Heart Health Benefits',
        text: 'Regular blood donation reduces iron build-up and may lower the risk of heart disease. Donating blood is good for the donor too!'
    },
    {
        icon: '🧬',
        title: 'Free Health Check',
        text: 'Every donation includes a free mini health screening — blood pressure, pulse, temperature, and hemoglobin level checks.'
    },
    {
        icon: '🌡️',
        title: 'Feeling Sick? Wait',
        text: 'If you have a fever, cold, or infection, wait until you are fully recovered. Donating while sick can be harmful to both you and the recipient.'
    }
];

const HealthTipsSection = () => {
    // Daily rotation: pick tip by day-of-year index (SRS FR-14.4)
    const dayOfYear = Math.floor(
        (new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
    );
    const todayTip = HEALTH_TIPS[dayOfYear % HEALTH_TIPS.length];

    return (
        <div style={{
            background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.08), rgba(33, 150, 243, 0.02))',
            border: '1px solid rgba(33, 150, 243, 0.15)',
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
                <span style={{ fontSize: '1.3rem' }}>💡</span>
                <h3 style={{
                    color: '#64b5f6',
                    fontSize: '1rem',
                    fontWeight: 600,
                    margin: 0
                }}>
                    Daily Health Tip
                </h3>
            </div>

            {/* Tip Content */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem' }}>
                <span style={{ fontSize: '2rem', lineHeight: 1 }}>{todayTip.icon}</span>
                <div>
                    <h4 style={{
                        color: 'rgba(255, 255, 255, 0.85)',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        margin: '0 0 0.3rem 0'
                    }}>
                        {todayTip.title}
                    </h4>
                    <p style={{
                        color: 'rgba(255, 255, 255, 0.55)',
                        fontSize: '0.85rem',
                        lineHeight: 1.6,
                        margin: 0
                    }}>
                        {todayTip.text}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HealthTipsSection;
