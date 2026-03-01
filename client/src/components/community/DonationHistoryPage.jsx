import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import '../donor/DonorProfile.css';
import './HistoryFilters.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const DonationHistoryPage = () => {
    const { user, token } = useAuth();
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter state
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [bloodTypeFilter, setBloodTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const statuses = ['Scheduled', 'Completed', 'Cancelled'];

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (fromDate) params.append('from', fromDate);
            if (toDate) params.append('to', toDate);
            if (bloodTypeFilter) params.append('bloodType', bloodTypeFilter);
            if (statusFilter) params.append('status', statusFilter);

            const res = await axios.get(
                `${API_URL}/community/donors/${user._id}/history?${params.toString()}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setDonations(res.data);
        } catch (err) {
            console.error('Failed to load history:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchHistory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, token]);

    const handleApplyFilters = () => {
        fetchHistory();
    };

    const handleClearFilters = () => {
        setFromDate('');
        setToDate('');
        setBloodTypeFilter('');
        setStatusFilter('');
        // Fetch without filters after clearing
        setTimeout(() => fetchHistory(), 0);
    };

    // Hand-written CSV export — no library (course requirement)
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

                {/* Filter Controls */}
                <div className="history-filters">
                    <div className="filter-row">
                        <div className="filter-group">
                            <label>From Date</label>
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                            />
                        </div>
                        <div className="filter-group">
                            <label>To Date</label>
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                            />
                        </div>
                        <div className="filter-group">
                            <label>Blood Type</label>
                            <select
                                value={bloodTypeFilter}
                                onChange={(e) => setBloodTypeFilter(e.target.value)}
                            >
                                <option value="">All Types</option>
                                {bloodTypes.map(bt => (
                                    <option key={bt} value={bt}>{bt}</option>
                                ))}
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">All Statuses</option>
                                {statuses.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="filter-actions">
                        <button onClick={handleApplyFilters} className="filter-btn filter-btn-apply">
                            🔍 Apply Filters
                        </button>
                        <button onClick={handleClearFilters} className="filter-btn filter-btn-clear">
                            ✕ Clear
                        </button>
                    </div>
                </div>

                {donations.length === 0 ? (
                    <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '3rem' }}>
                        No donation records found. {fromDate || toDate || bloodTypeFilter || statusFilter ? 'Try adjusting your filters.' : 'Start donating to build your history!'}
                    </p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <p className="results-count">{donations.length} record{donations.length !== 1 ? 's' : ''} found</p>
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
