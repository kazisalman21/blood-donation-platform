import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import '../donor/AuthPages.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const PostRequestPage = () => {
    const [formData, setFormData] = useState({
        bloodType: '', unitsNeeded: 1, hospital: '', location: '', urgency: 'Normal'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await axios.post(`${API_URL}/requests`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess(`Request posted! ${res.data.eligibleDonorsCount} donors notified.`);
            setTimeout(() => navigate('/history/requests'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to post request');
        } finally {
            setLoading(false);
        }
    };

    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    return (
        <div className="auth-page">
            <div className="auth-card" style={{ maxWidth: '550px' }}>
                <h1 className="auth-title">🚨 Emergency Blood Request</h1>
                <p className="auth-subtitle">Post a request to find matching donors</p>

                {error && <div className="error-msg">{error}</div>}
                {success && <div className="error-msg" style={{ background: 'rgba(76,175,80,0.15)', borderColor: 'rgba(76,175,80,0.3)', color: '#4caf50' }}>{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Blood Type Needed *</label>
                        <div className="blood-type-grid">
                            {bloodTypes.map(bt => (
                                <button
                                    type="button" key={bt}
                                    className={`blood-type-btn ${formData.bloodType === bt ? 'selected' : ''}`}
                                    onClick={() => setFormData(prev => ({ ...prev, bloodType: bt }))}
                                >
                                    {bt}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Units Needed (1-10) *</label>
                        <input type="number" name="unitsNeeded" value={formData.unitsNeeded}
                            onChange={handleChange} min="1" max="10" required />
                    </div>

                    <div className="form-group">
                        <label>Hospital Name *</label>
                        <input type="text" name="hospital" value={formData.hospital}
                            onChange={handleChange} placeholder="e.g. Dhaka Medical College" required />
                    </div>

                    <div className="form-group">
                        <label>Location / City *</label>
                        <input type="text" name="location" value={formData.location}
                            onChange={handleChange} placeholder="e.g. Dhaka" required />
                    </div>

                    <div className="form-group">
                        <label>Urgency Level</label>
                        <div style={{ display: 'flex', gap: '0.6rem' }}>
                            {['Critical', 'Urgent', 'Normal'].map(u => (
                                <button
                                    type="button" key={u}
                                    className={`blood-type-btn ${formData.urgency === u ? 'selected' : ''}`}
                                    style={{
                                        borderColor: formData.urgency === u
                                            ? (u === 'Critical' ? '#ef5350' : u === 'Urgent' ? '#ff9800' : '#4caf50')
                                            : undefined,
                                        color: formData.urgency === u
                                            ? (u === 'Critical' ? '#ef5350' : u === 'Urgent' ? '#ff9800' : '#4caf50')
                                            : undefined
                                    }}
                                    onClick={() => setFormData(prev => ({ ...prev, urgency: u }))}
                                >
                                    {u}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary full-width" disabled={loading}>
                        {loading ? 'Posting...' : 'Post Emergency Request 🚨'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PostRequestPage;
