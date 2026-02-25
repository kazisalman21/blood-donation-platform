import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import '../donor/DonorProfile.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const DonationHistoryPage = () => {
    const { user, token } = useAuth();
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get(`${API_URL}/community/donors/${user._id}/history`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDonations(res.data);
            } catch (err) {
                console.error('Failed to load history:', err);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchHistory();
    }, [user, token]);

    // Hand-written CSV export — no library
    const exportCSV = () => {
        const headers = ['Date', 'Blood Type', 'Location', 'Recipient', 'Status'];
        const rows = donations.map(d => [
            new Date(d.donationDate).toLocaleDateString(),
            d.bloodType,
            d.location || '',
            d.recipientAnonymized || '',
            d.status
        ]);
        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'donation_history.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    if (loading) return <div className="loading-screen">Loading history...</div>;

    return (
        <div className="profile-page">
            <div className="profile-card" style={{ maxWidth: '900px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h1 style={{ color: '#fff', fontSize: '1.5rem' }}>📊 Donation History</h1>
                    <button onClick={exportCSV} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
                        Export CSV ↓
                    </button>
                </div>

                {donations.length === 0 ? (
                    <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '3rem' }}>
                        No donation records yet. Start donating to build your history!
                    </p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    {['Date', 'Blood Type', 'Location', 'Recipient', 'Status'].map(h => (
                                        <th key={h} style={{ padding: '0.8rem', textAlign: 'left', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textTransform: 'uppercase' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {donations.map((d, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '0.8rem', color: '#fff' }}>{new Date(d.donationDate).toLocaleDateString()}</td>
                                        <td style={{ padding: '0.8rem' }}><span className="blood-badge" style={{ fontSize: '0.8rem' }}>{d.bloodType}</span></td>
                                        <td style={{ padding: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>{d.location}</td>
                                        <td style={{ padding: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>{d.recipientAnonymized}</td>
                                        <td style={{ padding: '0.8rem' }}>
                                            <span className={`urgency-badge urgency-${d.status === 'Completed' ? 'Normal' : d.status === 'Cancelled' ? 'Critical' : 'Urgent'}`}>
                                                {d.status}
                                            </span>
                                        </td>
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

export default DonationHistoryPage;
