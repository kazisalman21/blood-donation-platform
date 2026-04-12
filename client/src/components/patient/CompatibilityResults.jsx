import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './CompatibilityResults.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * CompatibilityResults — Displays blood compatibility matching results.
 * Shows matched donors grouped by compatibility level (exact, Rh-compatible, cross-group).
 * Hand-written scoring visualization — no external library.
 *
 * @param {string} requestId - The blood request ID to fetch compatible donors for
 * @param {string} neededBloodType - The blood type needed (for display)
 */
const CompatibilityResults = ({ requestId, neededBloodType }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useAuth();

    useEffect(() => {
        if (requestId) {
            fetchCompatibleDonors();
        }
    }, [requestId]);

    const fetchCompatibleDonors = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/requests/${requestId}/compatible-donors`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(res.data);
        } catch (err) {
            setError('Failed to load compatibility results');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="compatibility-loading">
                <div className="loading-spinner"></div>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem' }}>
                    Analyzing blood compatibility...
                </p>
            </div>
        );
    }

    if (error) {
        return <div className="post-error-msg">{error}</div>;
    }

    if (!data) return null;

    const { compatibleBloodTypes, totalDonors, donors } = data;

    // No donors found
    if (totalDonors === 0) {
        return (
            <div className="compatibility-section">
                <div className="compatibility-header">
                    <h2>🔬 Compatibility Results</h2>
                </div>

                <div className="compatible-types-bar">
                    <span className="compatible-types-label">Compatible types for {neededBloodType}:</span>
                    {compatibleBloodTypes.map(bt => (
                        <span key={bt} className={`compatible-type-chip ${bt === neededBloodType ? 'exact' : ''}`}>
                            {bt}
                        </span>
                    ))}
                </div>

                <div className="compatibility-empty">
                    <span className="empty-icon">🔍</span>
                    <h3>No Compatible Donors Found</h3>
                    <p>
                        No available donors with compatible blood types ({compatibleBloodTypes.join(', ')})
                        were found in your area. Your request remains active and donors will be notified as they become available.
                    </p>
                </div>
            </div>
        );
    }

    // Group definitions
    const groups = [
        {
            key: 'exactMatch',
            title: 'Exact Match',
            subtitle: 'Same blood type — best compatibility',
            icon: '🟢',
            iconClass: 'exact',
            countClass: 'exact',
            donors: donors.exactMatch || [],
            scoreClass: 'score-3'
        },
        {
            key: 'rhCompatible',
            title: 'Rh-Compatible',
            subtitle: 'Same ABO group, different Rh factor',
            icon: '🔵',
            iconClass: 'rh',
            countClass: 'rh',
            donors: donors.rhCompatible || [],
            scoreClass: 'score-2'
        },
        {
            key: 'crossCompatible',
            title: 'Cross-Compatible',
            subtitle: 'Different ABO group but can safely donate',
            icon: '🟣',
            iconClass: 'cross',
            countClass: 'cross',
            donors: donors.crossCompatible || [],
            scoreClass: 'score-1'
        }
    ];

    return (
        <div className="compatibility-section" id="compatibility-results">
            <div className="compatibility-header">
                <h2>🔬 Compatibility Results</h2>
                <span className="total-donors-badge">
                    ✅ {totalDonors} donor{totalDonors !== 1 ? 's' : ''} found
                </span>
            </div>

            {/* Compatible blood types bar */}
            <div className="compatible-types-bar">
                <span className="compatible-types-label">Compatible types for {neededBloodType}:</span>
                {compatibleBloodTypes.map(bt => (
                    <span key={bt} className={`compatible-type-chip ${bt === neededBloodType ? 'exact' : ''}`}>
                        {bt}
                    </span>
                ))}
            </div>

            {/* Donor groups */}
            <div className="compatibility-groups">
                {groups.map(group => {
                    if (group.donors.length === 0) return null;
                    return (
                        <div className="compatibility-group" key={group.key} id={`group-${group.key}`}>
                            <div className="group-header">
                                <div className="group-title">
                                    <div className={`group-icon ${group.iconClass}`}>{group.icon}</div>
                                    <div>
                                        <h3>{group.title}</h3>
                                        <p>{group.subtitle}</p>
                                    </div>
                                </div>
                                <span className={`group-count ${group.countClass}`}>
                                    {group.donors.length} donor{group.donors.length > 1 ? 's' : ''}
                                </span>
                            </div>
                            <div className="donor-list">
                                {group.donors.map(donor => (
                                    <div className="donor-item" key={donor._id}>
                                        <div className="donor-info-row">
                                            <div className="donor-avatar">
                                                {donor.name?.charAt(0)?.toUpperCase() || '?'}
                                            </div>
                                            <div className="donor-details">
                                                <h4>
                                                    {donor.name}
                                                    {donor.isVerified && <span className="verified-badge" title="Verified Donor">✓</span>}
                                                </h4>
                                                <p>{donor.city || 'Unknown city'}{donor.area ? `, ${donor.area}` : ''}</p>
                                            </div>
                                            <span className="donor-blood-badge">{donor.bloodType}</span>
                                        </div>
                                        <div className="score-bar">
                                            <div className="score-fill">
                                                <div className={`score-fill-inner ${group.scoreClass}`}></div>
                                            </div>
                                            <span className="score-text">{donor.compatibilityLabel}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CompatibilityResults;
