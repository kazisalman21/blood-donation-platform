/**
 * LeaderboardPage — View layer for Feature 13 (Donor Leaderboard & Recognition)
 * Owner: Miskatul Afrin Anika
 * Controller: communityController.getLeaderboard()
 * Model: Donation.js (aggregation), Donor.js (badges, city)
 * 
 * SRS Requirements:
 * FR-13.1: Monthly and All-Time tabs
 * FR-13.2: City filter dropdown
 * FR-13.3: Medal icons for top 3
 * FR-13.4: MongoDB aggregation (backend — no library)
 * FR-13.5: Earned badges in color, unearned in grayscale
 * FR-13.6: Milestone popup animation
 */
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import BadgeShowcase from './BadgeShowcase';
import '../donor/DonorProfile.css';
import './Leaderboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Medal icons for top 3 donors (SRS FR-13.3)
const MEDALS = ['🥇', '🥈', '🥉'];

// Cities for filter (SRS FR-13.2)
const CITIES = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh'];

const LeaderboardPage = () => {
    const { token } = useAuth();
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Tab state: monthly or allTime (SRS FR-13.1)
    const [tab, setTab] = useState('allTime');

    // City filter state (SRS FR-13.2)
    const [city, setCity] = useState('');

    // Expanded row for badge showcase
    const [expandedRow, setExpandedRow] = useState(null);

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('type', tab);
            if (city) params.append('city', city);

            const res = await axios.get(
                `${API_URL}/community/leaderboard?${params.toString()}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setLeaders(res.data);
        } catch (err) {
            console.error('Failed to load leaderboard:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch when tab or city changes
    useEffect(() => {
        fetchLeaderboard();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab, city, token]);

    const toggleRow = (index) => {
        setExpandedRow(expandedRow === index ? null : index);
    };

    if (loading) return <div className="loading-screen">Loading leaderboard...</div>;

    return (
        <div className="profile-page">
            <div className="profile-card" style={{ maxWidth: '950px' }}>
                <h1 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                    🏆 Donor Leaderboard
                </h1>

                {/* Tab Toggle — Monthly / All Time (FR-13.1) */}
                <div className="leaderboard-tabs">
                    <button
                        className={`tab-btn ${tab === 'allTime' ? 'active' : ''}`}
                        onClick={() => setTab('allTime')}
                    >
                        All Time
                    </button>
                    <button
                        className={`tab-btn ${tab === 'monthly' ? 'active' : ''}`}
                        onClick={() => setTab('monthly')}
                    >
                        This Month
                    </button>
                </div>

                {/* City Filter (FR-13.2) */}
                <div className="leaderboard-city-filter">
                    <label>Filter by City</label>
                    <select value={city} onChange={(e) => setCity(e.target.value)}>
                        <option value="">All Cities</option>
                        {CITIES.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                {/* Leaderboard Table */}
                {leaders.length === 0 ? (
                    <div className="leaderboard-empty">
                        No donors found{city ? ` in ${city}` : ''} for {tab === 'monthly' ? 'this month' : 'all time'}.
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="leaderboard-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '60px' }}>Rank</th>
                                    <th>Donor</th>
                                    <th>Blood Type</th>
                                    <th>City</th>
                                    <th style={{ textAlign: 'center' }}>Donations</th>
                                    <th style={{ width: '40px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaders.map((entry, i) => (
                                    <React.Fragment key={entry._id}>
                                        <tr
                                            className={i < 3 ? `rank-${i + 1}` : ''}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => toggleRow(i)}
                                        >
                                            {/* Rank with Medal (FR-13.3) */}
                                            <td>
                                                <div className="rank-cell">
                                                    {i < 3 ? (
                                                        <span className="rank-medal">{MEDALS[i]}</span>
                                                    ) : (
                                                        <span className="rank-number">{i + 1}</span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Donor Name + Verified Badge */}
                                            <td>
                                                <div className="donor-name-cell">
                                                    <span>{entry.donor?.name || 'Anonymous'}</span>
                                                    {entry.donor?.isVerified && (
                                                        <span className="verified-badge" title="Verified Donor">✓</span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Blood Type */}
                                            <td>
                                                <span className="blood-badge" style={{ fontSize: '0.8rem' }}>
                                                    {entry.donor?.bloodType}
                                                </span>
                                            </td>

                                            {/* City */}
                                            <td style={{ color: 'rgba(255,255,255,0.5)' }}>
                                                {entry.donor?.city || '—'}
                                            </td>

                                            {/* Donation Count */}
                                            <td style={{ textAlign: 'center' }}>
                                                <span className="donation-count">
                                                    {entry.totalDonations}
                                                </span>
                                            </td>

                                            {/* Expand Arrow */}
                                            <td>
                                                <span style={{
                                                    color: 'rgba(255,255,255,0.3)',
                                                    transform: expandedRow === i ? 'rotate(90deg)' : 'none',
                                                    display: 'inline-block',
                                                    transition: 'transform 0.2s'
                                                }}>▶</span>
                                            </td>
                                        </tr>

                                        {/* Expanded Badge Row (FR-13.5) */}
                                        {expandedRow === i && (
                                            <tr>
                                                <td colSpan="6" style={{ padding: '0 0.8rem 1rem' }}>
                                                    <div style={{
                                                        background: 'rgba(255, 255, 255, 0.02)',
                                                        border: '1px solid rgba(255, 255, 255, 0.06)',
                                                        borderRadius: '10px',
                                                        padding: '1rem'
                                                    }}>
                                                        <span style={{
                                                            color: 'rgba(255,255,255,0.4)',
                                                            fontSize: '0.75rem',
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.5px'
                                                        }}>
                                                            Badges & Milestones
                                                        </span>
                                                        <BadgeShowcase
                                                            earnedBadges={entry.donor?.badges || []}
                                                            donationCount={entry.totalDonations}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaderboardPage;
