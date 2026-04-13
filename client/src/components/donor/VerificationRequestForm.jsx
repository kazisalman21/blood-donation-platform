import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './VerificationRequest.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const VerificationRequestForm = () => {
    const { user, token } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [documentType, setDocumentType] = useState('national_id');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${API_URL}/donors/${user._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfile(res.data);
            } catch (err) {
                console.error('Failed to load profile:', err);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchProfile();
    }, [user, token]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB');
                return;
            }
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                setError('Only JPG, PNG, and PDF files are allowed');
                return;
            }
            setSelectedFile(file);
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!selectedFile) {
            setError('Please select a document to upload');
            return;
        }

        setSubmitting(true);

        try {
            // In a production app, we'd upload the file to cloud storage first
            // For this project, we simulate the document path
            const documentPath = `uploads/verification/${user._id}_${documentType}_${Date.now()}.${selectedFile.name.split('.').pop()}`;

            await axios.post(`${API_URL}/donors/${user._id}/verify`, {
                documentPath
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccess('Verification request submitted successfully! An admin will review your documents.');
            setProfile(prev => ({
                ...prev,
                verificationStatus: 'pending',
                verificationDocument: documentPath
            }));
            setSelectedFile(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit verification request');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="loading-screen">Loading...</div>;
    if (!profile) return <div className="error-screen">Failed to load profile</div>;

    const isVerified = profile.verificationStatus === 'verified';
    const isPending = profile.verificationStatus === 'pending';
    const isRejected = profile.verificationStatus === 'rejected';

    return (
        <div className="verification-page">
            <div className="verification-card">
                <h2>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    Verification Badge
                </h2>
                <p className="subtitle">
                    Get verified to build trust with requesters and appear higher in search results.
                </p>

                {/* Status Banner */}
                {isVerified && (
                    <div className="verification-status-banner status-verified">
                        <span className="status-icon">✅</span>
                        <div className="status-info">
                            <h3>You're Verified!</h3>
                            <p>Your identity has been confirmed. The verified badge is displayed on your profile.</p>
                        </div>
                    </div>
                )}

                {isPending && (
                    <div className="verification-status-banner status-pending">
                        <span className="status-icon">⏳</span>
                        <div className="status-info">
                            <h3>Verification Pending</h3>
                            <p>Your documents are being reviewed by an admin. This usually takes 24-48 hours.</p>
                        </div>
                    </div>
                )}

                {isRejected && (
                    <div className="verification-status-banner status-rejected">
                        <span className="status-icon">❌</span>
                        <div className="status-info">
                            <h3>Verification Rejected</h3>
                            <p>Your previous request was rejected. You can submit a new request with clearer documents.</p>
                        </div>
                    </div>
                )}

                {/* Benefits */}
                <div className="benefits-section">
                    <h3>Why Get Verified?</h3>
                    <div className="benefits-grid">
                        <div className="benefit-item">
                            <span className="benefit-icon">🛡️</span>
                            <span className="benefit-text">Verified badge on your profile builds trust</span>
                        </div>
                        <div className="benefit-item">
                            <span className="benefit-icon">🔝</span>
                            <span className="benefit-text">Appear higher in donor search results</span>
                        </div>
                        <div className="benefit-item">
                            <span className="benefit-icon">⚡</span>
                            <span className="benefit-text">Faster matching with urgent requests</span>
                        </div>
                        <div className="benefit-item">
                            <span className="benefit-icon">🏆</span>
                            <span className="benefit-text">Unlock exclusive milestone badges</span>
                        </div>
                    </div>
                </div>

                {/* Form — only show if not verified and not pending */}
                {!isVerified && !isPending && (
                    <form className="verification-form" onSubmit={handleSubmit}>
                        {error && <div className="verification-error">{error}</div>}
                        {success && <div className="verification-success">{success}</div>}

                        <div className="form-group">
                            <label htmlFor="docType">Document Type</label>
                            <select
                                id="docType"
                                className="document-type-select"
                                value={documentType}
                                onChange={(e) => setDocumentType(e.target.value)}
                            >
                                <option value="national_id">National ID (NID)</option>
                                <option value="passport">Passport</option>
                                <option value="driving_license">Driving License</option>
                                <option value="student_id">Student ID Card</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Upload Document</label>
                            <div
                                className={`file-upload-area ${selectedFile ? 'has-file' : ''}`}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept=".jpg,.jpeg,.png,.pdf"
                                />
                                {selectedFile ? (
                                    <>
                                        <div className="upload-icon">📄</div>
                                        <p className="selected-file">{selectedFile.name}</p>
                                        <p className="file-hint">Click to change file</p>
                                    </>
                                ) : (
                                    <>
                                        <div className="upload-icon">📁</div>
                                        <p>Click to upload your document</p>
                                        <p className="file-hint">JPG, PNG, or PDF — Max 5MB</p>
                                    </>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-submit-verification"
                            disabled={submitting || !selectedFile}
                        >
                            {submitting ? (
                                <>Submitting...</>
                            ) : (
                                <>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                    Submit Verification Request
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default VerificationRequestForm;
