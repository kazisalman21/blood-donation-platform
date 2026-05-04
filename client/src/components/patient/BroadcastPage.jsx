import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './BroadcastPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const CITIES = [
    'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna',
    'Barisal', 'Rangpur', 'Mymensingh', 'Comilla', 'Gazipur',
    'Narayanganj', 'Bogra', "Cox's Bazar", 'Jessore', 'Dinajpur'
];

/**
 * Hand-written relative time formatter — no external library (course requirement).
 */
const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay < 30) return `${diffDay}d ago`;
    return date.toLocaleDateString();
};

/**
 * BroadcastPage — F19 Broadcast Emergency Alerts
 * Admin sends mass alerts to donors filtered by blood type and city.
 * Shows preview of how many donors will be notified before sending.
 */
const BroadcastPage = () => {
    const [bloodType, setBloodType] = useState('');
    const [city, setCity] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setSending] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setHistoryLoading(true);
        try {
            const res = await axios.get(`${API_URL}/admin/broadcast/history`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistory(res.data);
        } catch (err) {
            console.error('Error fetching history:', err);
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!bloodType || !city || !message.trim()) {
            setError('Please fill in all fields');
            return;
        }
        if (message.length > 200) {
            setError('Message must be 200 characters or less');
            return;
        }

        setSending(true);
        setError('');
        setSuccess('');

        try {
            const res = await axios.post(`${API_URL}/admin/broadcast`, {
                bloodType, city, message: message.trim()
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess(`✅ Broadcast sent! ${res.data.notified} donor${res.data.notified !== 1 ? 's' : ''} notified.`);
            setMessage('');
            fetchHistory(); // Refresh history
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send broadcast');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="broadcast-page">
            <div className="broadcast-container">
                <div className="broadcast-header">
                    <h1>📢 Broadcast Emergency Alert</h1>
                    <p>Send mass notifications to compatible donors in a specific city</p>
                </div>

                <div className="broadcast-layout">
                    {/* Send Form */}
                    <div className="broadcast-form-card">
                        <h2>🚨 New Broadcast</h2>

                        {success && <div className="broadcast-success">{success}</div>}
                        {error && <div className="broadcast-error">{error}</div>}

                        <form onSubmit={handleSend} id="broadcast-form">
                            <div className="broadcast-form-group">
                                <label htmlFor="broadcast-blood">Blood Type Needed *</label>
                                <select id="broadcast-blood" value={bloodType}
                                    onChange={(e) => setBloodType(e.target.value)}>
                                    <option value="">Select blood type</option>
                                    {BLOOD_TYPES.map(bt => (
                                        <option key={bt} value={bt}>{bt}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="broadcast-form-group">
                                <label htmlFor="broadcast-city">Target City *</label>
                                <select id="broadcast-city" value={city}
                                    onChange={(e) => setCity(e.target.value)}>
                                    <option value="">Select city</option>
                                    {CITIES.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="broadcast-form-group">
                                <label htmlFor="broadcast-message">Alert Message *</label>
                                <textarea id="broadcast-message" value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Urgent need for blood at Dhaka Medical College Hospital..."
                                    maxLength={200} />
                                <div className="broadcast-char-count">{message.length}/200</div>
                            </div>

                            {/* Live preview */}
                            {bloodType && city && message.trim() && (
                                <div className="broadcast-preview">
                                    <p>
                                        <strong>Preview:</strong> All available <strong>{bloodType}</strong>-compatible
                                        donors in <strong>{city}</strong> will receive this alert:
                                    </p>
                                    <p style={{marginTop: '0.5rem', fontStyle: 'italic'}}>"{message.trim()}"</p>
                                </div>
                            )}

                            <button type="submit" className="broadcast-send-btn" disabled={loading}
                                id="send-broadcast-btn">
                                {loading ? 'Sending...' : '📢 Send Broadcast Alert'}
                            </button>
                        </form>
                    </div>

                    {/* History */}
                    <div className="broadcast-history-card">
                        <h2>📋 Broadcast History</h2>
                        <div className="history-list">
                            {historyLoading ? (
                                <div className="history-empty">Loading history...</div>
                            ) : history.length === 0 ? (
                                <div className="history-empty">No broadcasts sent yet</div>
                            ) : (
                                history.map(item => (
                                    <div className="history-item" key={item._id}>
                                        <div className="history-item-top">
                                            <div className="history-badges">
                                                <span className="history-badge blood">{item.bloodType}</span>
                                                <span className="history-badge city">{item.city}</span>
                                            </div>
                                            <span className="history-notified">
                                                ✅ {item.donorsNotified} notified
                                            </span>
                                        </div>
                                        <p className="history-message">{item.message}</p>
                                        <span className="history-meta">
                                            {item.sentBy?.name || 'Admin'} • {getTimeAgo(item.sentAt || item.createdAt)}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BroadcastPage;
