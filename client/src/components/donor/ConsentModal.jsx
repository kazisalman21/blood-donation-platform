/**
 * ConsentModal — View layer for Feature 4 (Request Response & Dual-Consent Flow)
 * Owner: Kazi Salman Salim (23101209)
 * Controller: requestController.respondToRequest()
 * Model: BloodRequest.js
 *
 * SRS Requirements:
 * FR-4.2: Confirmation dialog before submitting accept/decline response
 *
 * Reusable confirmation modal that prevents accidental accept/decline clicks.
 * Shows request details and action-specific messaging before final submission.
 */

import React from 'react';

const ConsentModal = ({ isOpen, action, requestInfo, onConfirm, onCancel, loading }) => {
    if (!isOpen) return null;

    const isAccept = action === 'accept';

    return (
        <div className="consent-modal-overlay" onClick={onCancel}>
            <div className="consent-modal" onClick={(e) => e.stopPropagation()}>
                {/* Modal Header */}
                <div className={`consent-modal-header ${isAccept ? 'accept' : 'decline'}`}>
                    <div className="consent-modal-icon">
                        {isAccept ? (
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 6 9 17l-5-5" />
                            </svg>
                        ) : (
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6 6 18M6 6l12 12" />
                            </svg>
                        )}
                    </div>
                    <h3>{isAccept ? 'Accept Blood Request' : 'Decline Blood Request'}</h3>
                </div>

                {/* Modal Body */}
                <div className="consent-modal-body">
                    {isAccept ? (
                        <>
                            <p className="consent-modal-desc">
                                You are about to accept a blood donation request. Please review the details below:
                            </p>
                            <div className="consent-request-details">
                                {requestInfo?.bloodType && (
                                    <div className="consent-detail-row">
                                        <span className="consent-detail-label">Blood Type</span>
                                        <span className="consent-detail-value blood-badge">{requestInfo.bloodType}</span>
                                    </div>
                                )}
                                {requestInfo?.hospital && (
                                    <div className="consent-detail-row">
                                        <span className="consent-detail-label">Hospital</span>
                                        <span className="consent-detail-value">{requestInfo.hospital}</span>
                                    </div>
                                )}
                                {requestInfo?.urgency && (
                                    <div className="consent-detail-row">
                                        <span className="consent-detail-label">Urgency</span>
                                        <span className={`consent-detail-value notif-urgency-tag notif-urgency-${requestInfo.urgency.toLowerCase()}`}>
                                            {requestInfo.urgency}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="consent-modal-notice">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 16v-4M12 8h.01" />
                                </svg>
                                <span>
                                    After you accept, the requester will be notified and can choose to share contact details with you.
                                </span>
                            </div>
                        </>
                    ) : (
                        <p className="consent-modal-desc">
                            Are you sure you want to decline this request? This action cannot be undone and the request will remain open for other donors.
                        </p>
                    )}
                </div>

                {/* Modal Actions */}
                <div className="consent-modal-actions">
                    <button
                        className="consent-btn consent-btn-cancel"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        className={`consent-btn ${isAccept ? 'consent-btn-accept' : 'consent-btn-decline'}`}
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="consent-btn-loading">
                                <span className="notif-spinner" style={{ width: 16, height: 16 }} />
                                Processing...
                            </span>
                        ) : (
                            isAccept ? '✓ Accept Request' : '✕ Decline Request'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConsentModal;
