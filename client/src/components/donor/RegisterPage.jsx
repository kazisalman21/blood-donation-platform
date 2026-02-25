import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './AuthPages.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const RegisterPage = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', confirmPassword: '',
        bloodType: '', city: '', area: '', phone: '',
        diabetic: false, onMedication: false, recentSurgery: false
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const nextStep = () => {
        if (step === 1 && (!formData.name || !formData.email || !formData.password)) {
            setError('Please fill in all required fields');
            return;
        }
        if (step === 1 && formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setError('');
        setStep(prev => prev + 1);
    };

    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.bloodType) {
            setError('Please select a blood type');
            return;
        }
        setLoading(true);
        setError('');

        try {
            const res = await axios.post(`${API_URL}/donors/register`, {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                bloodType: formData.bloodType,
                city: formData.city,
                area: formData.area,
                phone: formData.phone,
                medicalFlags: {
                    diabetic: formData.diabetic,
                    onMedication: formData.onMedication,
                    recentSurgery: formData.recentSurgery
                }
            });

            login(res.data, res.data.token);
            navigate('/profile');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1 className="auth-title">🩸 Join BloodConnect</h1>
                <p className="auth-subtitle">Step {step} of 3</p>

                <div className="step-indicator">
                    {[1, 2, 3].map(s => (
                        <div key={s} className={`step-dot ${s === step ? 'active' : s < step ? 'done' : ''}`} />
                    ))}
                </div>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {step === 1 && (
                        <div className="form-step">
                            <div className="form-group">
                                <label>Full Name *</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" required />
                            </div>
                            <div className="form-group">
                                <label>Email *</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" required />
                            </div>
                            <div className="form-group">
                                <label>Password *</label>
                                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Min 6 characters" required />
                            </div>
                            <div className="form-group">
                                <label>Confirm Password *</label>
                                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Re-enter password" required />
                            </div>
                            <button type="button" className="btn btn-primary full-width" onClick={nextStep}>Next →</button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="form-step">
                            <div className="form-group">
                                <label>Blood Type *</label>
                                <div className="blood-type-grid">
                                    {bloodTypes.map(bt => (
                                        <button
                                            type="button"
                                            key={bt}
                                            className={`blood-type-btn ${formData.bloodType === bt ? 'selected' : ''}`}
                                            onClick={() => setFormData(prev => ({ ...prev, bloodType: bt }))}
                                        >
                                            {bt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="form-group">
                                <label>City</label>
                                <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="e.g. Dhaka" />
                            </div>
                            <div className="form-group">
                                <label>Area</label>
                                <input type="text" name="area" value={formData.area} onChange={handleChange} placeholder="e.g. Dhanmondi" />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+880-1XXX-XXXXXX" />
                            </div>
                            <div className="btn-group">
                                <button type="button" className="btn btn-secondary" onClick={prevStep}>← Back</button>
                                <button type="button" className="btn btn-primary" onClick={nextStep}>Next →</button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="form-step">
                            <p className="step-label">Medical Flags (optional)</p>
                            <div className="checkbox-group">
                                <label className="checkbox-label">
                                    <input type="checkbox" name="diabetic" checked={formData.diabetic} onChange={handleChange} />
                                    <span>Diabetic</span>
                                </label>
                                <label className="checkbox-label">
                                    <input type="checkbox" name="onMedication" checked={formData.onMedication} onChange={handleChange} />
                                    <span>Currently on medication</span>
                                </label>
                                <label className="checkbox-label">
                                    <input type="checkbox" name="recentSurgery" checked={formData.recentSurgery} onChange={handleChange} />
                                    <span>Recent surgery (last 6 months)</span>
                                </label>
                            </div>
                            <div className="btn-group">
                                <button type="button" className="btn btn-secondary" onClick={prevStep}>← Back</button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Registering...' : 'Create Account 🩸'}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
