import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import '../donor/DonorProfile.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const RequestHistoryPage = () => {
    const { user, token } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get(`${API_URL}/community/requesters/${user._id}/history`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRequests(res.data);
            } catch (err) {
                console.error('Failed to load request history:', err);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchHistory();
    }, [user, token]);

    if (loading) return <div className="loading-screen">Loading request history...</div>;

    return (
        <div className="profile-page">
            <div className="profile-card" style={{ maxWidth: '900px' }}>
                <h1 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1.5rem' }}>📋 Request History</h1>

                {requests.length === 0 ? (
                    <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '3rem' }}>
                        No blood requests yet.
                    </p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    {['Date', 'Blood Type', 'Units', 'Hospital', 'Urgency', 'Status'].map(h => (
                                        <th key={h} style={{ padding: '0.8rem', textAlign: 'left', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textTransform: 'uppercase' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((r, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '0.8rem', color: '#fff' }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                                        <td style={{ padding: '0.8rem' }}><span className="blood-badge" style={{ fontSize: '0.8rem' }}>{r.bloodType}</span></td>
                                        <td style={{ padding: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>{r.unitsNeeded}</td>
                                        <td style={{ padding: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>{r.hospital}</td>
                                        <td style={{ padding: '0.8rem' }}>
                                            <span className={`urgency-badge urgency-${r.urgency}`}>{r.urgency}</span>
                                        </td>
                                        <td style={{ padding: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>{r.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RequestHistoryPage;
