/**
 * ContactCard — View layer for Feature 7 (Privacy-Protected Contact Sharing)
 * Owner: Kazi Salman Salim (23101209)
 * Controller: requestController.getContactInfo()
 * Model: BloodRequest.js
 *
 * SRS Requirements:
 * FR-7.1: Contact info masked until dual consent
 * FR-7.2: After dual consent, full contact revealed
 * FR-7.3: Contact card on request detail view
 *
 * Displays contact info for both donor and requester.
 * Shows masked data when locked, full data when both parties consent.
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './ContactCard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ContactCard = ({ requestId }) => {
    const { token } = useAuth();
    const [contactData, setContactData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (requestId && token) {
            fetchContactInfo();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [requestId, token]);

    const fetchContactInfo = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.get(`${API_URL}/requests/${requestId}/contact`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setContactData(res.data);
        } catch (err) {
            console.error('Failed to fetch contact info:', err);
            setError('Unable to load contact information');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="contact-card loading">
                <div className="contact-card-spinner" />
                <span>Loading contact info...</span>
            </div>
        );
    }

    if (error) {
        return <div className="contact-card error">{error}</div>;
    }

    if (!contactData) return null;

    const { unlocked, donor, requester, message } = contactData;

    // Render a single person's contact info
    const renderPerson = (person, role) => (
        <div className="contact-person">
            <h4 className="contact-role">{role}</h4>
            <div className="contact-fields">
                <div className={`contact-field ${!unlocked ? 'masked' : ''}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span>{person?.name || 'N/A'}</span>
                </div>
                <div className={`contact-field ${!unlocked ? 'masked' : ''}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <span>{person?.email || 'N/A'}</span>
                </div>
                <div className={`contact-field ${!unlocked ? 'masked' : ''}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
                    </svg>
                    <span>{person?.phone || 'N/A'}</span>
                </div>
                <div className={`contact-field ${!unlocked ? 'masked' : ''}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{person?.city || 'N/A'}</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className={`contact-card ${unlocked ? 'unlocked' : 'locked'}`}>
            {/* Header */}
            <div className="contact-card-header">
                <div className="contact-card-icon">
                    {unlocked ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                        </svg>
                    ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                    )}
                </div>
                <div>
                    <h3 className="contact-card-title">
                        {unlocked ? 'Contact Information Shared' : 'Contact Info Locked'}
                    </h3>
                    {!unlocked && message && (
                        <p className="contact-card-subtitle">{message}</p>
                    )}
                </div>
            </div>

            {/* Contact Grid */}
            <div className="contact-info-grid">
                {renderPerson(donor, 'Donor')}
                {renderPerson(requester, 'Requester')}
            </div>
        </div>
    );
};

export default ContactCard;
