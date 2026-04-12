import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './PostRequestPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const CITIES = [
    'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna',
    'Barisal', 'Rangpur', 'Mymensingh', 'Comilla', 'Gazipur',
    'Narayanganj', 'Bogra', 'Cox\'s Bazar', 'Jessore', 'Dinajpur'
];

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const PostRequestPage = () => {
    const [formData, setFormData] = useState({
        patientName: '',
        contactNumber: '',
        bloodType: '',
        unitsNeeded: 1,
        hospital: '',
        location: '',
        urgency: 'Normal',
        additionalNotes: ''
    });

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successData, setSuccessData] = useState(null);
    const { token } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear field error on change
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.patientName.trim()) newErrors.patientName = 'Patient name is required';
        if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required';
        if (!formData.bloodType) newErrors.bloodType = 'Please select a blood type';
        if (!formData.hospital.trim()) newErrors.hospital = 'Hospital name is required';
        if (!formData.location) newErrors.location = 'Please select a city';
        if (formData.unitsNeeded < 1 || formData.unitsNeeded > 10) newErrors.unitsNeeded = 'Units must be between 1 and 10';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setServerError('');

        try {
            const res = await axios.post(`${API_URL}/requests`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccessData(res.data);
        } catch (err) {
            setServerError(err.response?.data?.message || 'Failed to post request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Success modal
    if (successData) {
        const { eligibleDonorsCount, donorsByCompatibility } = successData;
        return (
            <div className="success-overlay" id="success-modal">
                <div className="success-modal">
                    <span className="success-icon">✅</span>
                    <h2>Request Posted Successfully!</h2>
                    <p>
                        Your emergency blood request has been submitted.
                        {eligibleDonorsCount > 0
                            ? ` ${eligibleDonorsCount} compatible donor(s) have been notified.`
                            : ' No compatible donors found in your area yet. Your request is posted and visible.'}
                    </p>

                    {eligibleDonorsCount > 0 && (
                        <div className="success-stats">
                            <div className="stat-box">
                                <span className="stat-number exact">{donorsByCompatibility.exactMatch}</span>
                                <span className="stat-label">Exact Match</span>
                            </div>
                            <div className="stat-box">
                                <span className="stat-number rh">{donorsByCompatibility.rhCompatible}</span>
                                <span className="stat-label">Rh-Compatible</span>
                            </div>
                            <div className="stat-box">
                                <span className="stat-number cross">{donorsByCompatibility.crossCompatible}</span>
                                <span className="stat-label">Cross-Group</span>
                            </div>
                        </div>
                    )}

                    <div className="success-actions">
                        <button className="btn btn-secondary" onClick={() => navigate('/requests/my')} id="view-requests-btn">
                            View My Requests
                        </button>
                        <button className="btn btn-primary" onClick={() => navigate(`/requests/${successData.request._id}`)} id="view-details-btn">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="post-request-page">
            <div className="post-request-card">
                <div className="post-request-header">
                    <span className="emergency-icon">🚨</span>
                    <h1 className="post-request-title">Emergency Blood Request</h1>
                    <p className="post-request-subtitle">Post a request to find matching donors in your area</p>
                </div>

                {serverError && <div className="post-error-msg" id="server-error">{serverError}</div>}

                <form onSubmit={handleSubmit} id="post-request-form">
                    {/* Patient Information */}
                    <div className="form-section">
                        <h3 className="form-section-title">👤 Patient Information</h3>
                        <div className="form-row">
                            <div className="post-form-group">
                                <label htmlFor="patientName">Patient Name *</label>
                                <input
                                    type="text" id="patientName" name="patientName"
                                    value={formData.patientName} onChange={handleChange}
                                    placeholder="Full name of the patient"
                                />
                                {errors.patientName && <div className="field-error">{errors.patientName}</div>}
                            </div>
                            <div className="post-form-group">
                                <label htmlFor="contactNumber">Contact Number *</label>
                                <input
                                    type="tel" id="contactNumber" name="contactNumber"
                                    value={formData.contactNumber} onChange={handleChange}
                                    placeholder="e.g. 01712345678"
                                />
                                {errors.contactNumber && <div className="field-error">{errors.contactNumber}</div>}
                            </div>
                        </div>
                    </div>

                    {/* Blood Requirements */}
                    <div className="form-section">
                        <h3 className="form-section-title">🩸 Blood Requirements</h3>

                        <div className="post-form-group">
                            <label>Blood Type Needed *</label>
                            <div className="blood-type-selector">
                                {BLOOD_TYPES.map(bt => (
                                    <button
                                        type="button" key={bt}
                                        className={`blood-type-option ${formData.bloodType === bt ? 'selected' : ''}`}
                                        onClick={() => {
                                            setFormData(prev => ({ ...prev, bloodType: bt }));
                                            if (errors.bloodType) setErrors(prev => ({ ...prev, bloodType: '' }));
                                        }}
                                        id={`blood-type-${bt.replace('+', 'pos').replace('-', 'neg')}`}
                                    >
                                        {bt}
                                    </button>
                                ))}
                            </div>
                            {errors.bloodType && <div className="field-error">{errors.bloodType}</div>}
                        </div>

                        <div className="post-form-group">
                            <label htmlFor="unitsNeeded">Units Needed (1–10) *</label>
                            <input
                                type="number" id="unitsNeeded" name="unitsNeeded"
                                value={formData.unitsNeeded} onChange={handleChange}
                                min="1" max="10"
                            />
                            {errors.unitsNeeded && <div className="field-error">{errors.unitsNeeded}</div>}
                        </div>
                    </div>

                    {/* Location Details */}
                    <div className="form-section">
                        <h3 className="form-section-title">📍 Location Details</h3>
                        <div className="post-form-group">
                            <label htmlFor="hospital">Hospital Name *</label>
                            <input
                                type="text" id="hospital" name="hospital"
                                value={formData.hospital} onChange={handleChange}
                                placeholder="e.g. Dhaka Medical College Hospital"
                            />
                            {errors.hospital && <div className="field-error">{errors.hospital}</div>}
                        </div>

                        <div className="post-form-group">
                            <label htmlFor="location">City *</label>
                            <select
                                id="location" name="location"
                                value={formData.location} onChange={handleChange}
                            >
                                <option value="">Select a city</option>
                                {CITIES.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                            {errors.location && <div className="field-error">{errors.location}</div>}
                        </div>
                    </div>

                    {/* Urgency & Notes */}
                    <div className="form-section">
                        <h3 className="form-section-title">⚡ Urgency & Additional Info</h3>

                        <div className="post-form-group">
                            <label>Urgency Level</label>
                            <div className="urgency-selector">
                                {['Critical', 'Urgent', 'Normal'].map(u => (
                                    <button
                                        type="button" key={u}
                                        className={`urgency-option ${formData.urgency === u ? `selected-${u}` : ''}`}
                                        onClick={() => setFormData(prev => ({ ...prev, urgency: u }))}
                                        id={`urgency-${u.toLowerCase()}`}
                                    >
                                        <span className={`urgency-dot dot-${u}`}></span>
                                        {u}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="post-form-group">
                            <label htmlFor="additionalNotes">Additional Notes (Optional)</label>
                            <textarea
                                id="additionalNotes" name="additionalNotes"
                                value={formData.additionalNotes} onChange={handleChange}
                                placeholder="Any medical context, special requirements, or instructions..."
                                maxLength={500}
                            />
                            <div className="char-count">{formData.additionalNotes.length}/500</div>
                        </div>
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading} id="submit-request-btn">
                        {loading ? (
                            <><span className="btn-spinner"></span>Posting Request...</>
                        ) : (
                            'Post Emergency Request 🚨'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PostRequestPage;
