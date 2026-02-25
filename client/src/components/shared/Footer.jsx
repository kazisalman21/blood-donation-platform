import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            background: 'rgba(15, 15, 20, 0.95)',
            borderTop: '1px solid rgba(198, 40, 40, 0.2)',
            padding: '1.5rem 2rem',
            textAlign: 'center',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '0.85rem'
        }}>
            <p>🩸 BloodConnect — Saving Lives, One Donation at a Time</p>
            <p style={{ marginTop: '0.3rem', fontSize: '0.75rem' }}>
                CSE470 Group 6 — Salman · Anika · Athoy
            </p>
        </footer>
    );
};

export default Footer;
