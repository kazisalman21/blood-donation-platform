/**
 * NotificationPanel — View layer for Feature 3 (Notifications) + Feature 4 (Consent Flow)
 * Owner: Kazi Salman Salim (23101209)
 * Controller: notificationController.getNotifications(), markAsRead(), markAllAsRead()
 *             requestController.respondToRequest()
 * Model: Notification.js, BloodRequest.js
 *
 * SRS Requirements:
 * FR-3.3: Donor can view all notifications
 * FR-3.4: Notification shows read/unread state
 * FR-3.5: Donor can mark notifications as read
 * FR-4.1: Donor sees Accept/Decline on matched request notifications
 * FR-4.2: Confirmation dialog before submitting response
 *
 * Slide-out panel from the right side showing all donor notifications.
 * Supports mark-as-read (individual and bulk) with urgency-colored tags.
 * Includes Accept/Decline buttons with ConsentModal confirmation for blood requests.
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import ConsentModal from './ConsentModal';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Hand-written relative time formatter (no external library per faculty rules)
const getRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffWeek = Math.floor(diffDay / 7);
    const diffMonth = Math.floor(diffDay / 30);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin} min${diffMin > 1 ? 's' : ''} ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    if (diffWeek < 5) return `${diffWeek} week${diffWeek > 1 ? 's' : ''} ago`;
    return `${diffMonth} month${diffMonth > 1 ? 's' : ''} ago`;
};

// Urgency icon based on level
const getUrgencyIcon = (urgency) => {
    switch (urgency) {
        case 'Critical': return '🔴';
        case 'Urgent': return '🟠';
        default: return '🔵';
    }
};

const NotificationPanel = ({ isOpen, onClose, onCountUpdate }) => {
    const { user, token } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // F4: Consent flow state
    const [modalOpen, setModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState('accept');
    const [respondingNotif, setRespondingNotif] = useState(null);
    const [respondLoading, setRespondLoading] = useState(false);
    const [respondedRequests, setRespondedRequests] = useState({});

    // Fetch all notifications when panel opens
    useEffect(() => {
        if (isOpen && user && token) {
            fetchNotifications();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const fetchNotifications = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.get(`${API_URL}/donors/${user._id}/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(res.data.notifications);
            onCountUpdate(res.data.unreadCount);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
            setError('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    // Mark a single notification as read
    const handleMarkAsRead = async (notifId) => {
        try {
            await axios.put(`${API_URL}/donors/notifications/${notifId}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Update local state
            setNotifications(prev =>
                prev.map(n => n._id === notifId ? { ...n, isRead: true } : n)
            );
            // Decrement unread count
            const currentUnread = notifications.filter(n => !n.isRead).length;
            onCountUpdate(Math.max(0, currentUnread - 1));
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
        }
    };

    // Mark all notifications as read
    const handleMarkAllAsRead = async () => {
        try {
            await axios.put(`${API_URL}/donors/notifications/read-all`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Update local state
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            onCountUpdate(0);
        } catch (err) {
            console.error('Failed to mark all as read:', err);
        }
    };

    // F4: Open consent modal for accept/decline
    const handleOpenModal = (notif, action) => {
        setRespondingNotif(notif);
        setModalAction(action);
        setModalOpen(true);
    };

    // F4: Confirm accept/decline via API
    const handleConfirmResponse = async () => {
        if (!respondingNotif) return;
        setRespondLoading(true);
        try {
            const accept = modalAction === 'accept';
            await axios.put(`${API_URL}/requests/${respondingNotif.requestId?._id || respondingNotif.requestId}/respond`, 
                { accept },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Track response locally
            const reqId = respondingNotif.requestId?._id || respondingNotif.requestId;
            setRespondedRequests(prev => ({ ...prev, [reqId]: accept ? 'accepted' : 'declined' }));
            // Auto-mark notification as read
            await handleMarkAsRead(respondingNotif._id);
            setModalOpen(false);
            setRespondingNotif(null);
        } catch (err) {
            console.error('Failed to respond to request:', err);
            setError(err.response?.data?.message || 'Failed to respond');
        } finally {
            setRespondLoading(false);
        }
    };

    // Check if a notification's request has been responded to
    const getResponseStatus = (notif) => {
        const reqId = notif.requestId?._id || notif.requestId;
        if (respondedRequests[reqId]) return respondedRequests[reqId];
        // If request already has a matched donor, it was already accepted
        if (notif.requestId?.status === 'Donor Matched' || 
            notif.requestId?.status === 'Contact Shared' ||
            notif.requestId?.status === 'Scheduled' ||
            notif.requestId?.status === 'Completed') {
            return 'accepted';
        }
        return null;
    };

    const unreadExists = notifications.some(n => !n.isRead);

    return (
        <div className={`notification-panel ${isOpen ? 'open' : ''}`}>
            {/* Panel Header */}
            <div className="notif-panel-header">
                <div className="notif-panel-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    <h3>Notifications</h3>
                </div>
                <div className="notif-panel-actions">
                    {unreadExists && (
                        <button
                            className="notif-mark-all-btn"
                            onClick={handleMarkAllAsRead}
                            title="Mark all as read"
                        >
                            Mark all read
                        </button>
                    )}
                    <button
                        className="notif-close-btn"
                        onClick={onClose}
                        aria-label="Close notifications"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Panel Content */}
            <div className="notif-panel-content">
                {loading && (
                    <div className="notif-loading">
                        <div className="notif-spinner" />
                        <span>Loading notifications...</span>
                    </div>
                )}

                {error && (
                    <div className="notif-error">{error}</div>
                )}

                {!loading && !error && notifications.length === 0 && (
                    <div className="notif-empty">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                        <p>No notifications yet</p>
                        <span>You'll be notified when someone needs your blood type</span>
                    </div>
                )}

                {!loading && notifications.map(notif => (
                    <div
                        key={notif._id}
                        className={`notif-item ${notif.isRead ? 'read' : 'unread'}`}
                    >
                        <div className="notif-item-left">
                            {!notif.isRead && <span className="notif-unread-dot" />}
                            <span className="notif-urgency-icon">
                                {getUrgencyIcon(notif.urgency)}
                            </span>
                        </div>
                        <div className="notif-item-body">
                            <p className="notif-message">{notif.message}</p>
                            <div className="notif-meta">
                                <span className={`notif-urgency-tag notif-urgency-${(notif.urgency || 'normal').toLowerCase()}`}>
                                    {notif.urgency || 'Normal'}
                                </span>
                                {notif.hospital && (
                                    <span className="notif-hospital">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
                                        </svg>
                                        {notif.hospital}
                                    </span>
                                )}
                                <span className="notif-time">
                                    {getRelativeTime(notif.createdAt)}
                                </span>
                            </div>
                            {/* F4: Accept/Decline buttons or response status */}
                            {(() => {
                                const status = getResponseStatus(notif);
                                if (status === 'accepted') {
                                    return <p className="notif-responded notif-responded-accepted">✓ You accepted this request</p>;
                                } else if (status === 'declined') {
                                    return <p className="notif-responded notif-responded-declined">✕ You declined this request</p>;
                                } else if (notif.requestId?.status === 'Donors Notified' || notif.requestId?.status === 'Open') {
                                    return (
                                        <div className="notif-action-buttons">
                                            <button
                                                className="notif-accept-btn"
                                                onClick={(e) => { e.stopPropagation(); handleOpenModal(notif, 'accept'); }}
                                            >
                                                ✓ Accept
                                            </button>
                                            <button
                                                className="notif-decline-btn"
                                                onClick={(e) => { e.stopPropagation(); handleOpenModal(notif, 'decline'); }}
                                            >
                                                ✕ Decline
                                            </button>
                                        </div>
                                    );
                                }
                                return null;
                            })()}
                        </div>
                        {!notif.isRead && (
                            <button
                                className="notif-read-btn"
                                onClick={() => handleMarkAsRead(notif._id)}
                                title="Mark as read"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M20 6 9 17l-5-5" />
                                </svg>
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* F4: Consent confirmation modal */}
            <ConsentModal
                isOpen={modalOpen}
                action={modalAction}
                requestInfo={{
                    bloodType: respondingNotif?.bloodType,
                    hospital: respondingNotif?.hospital,
                    urgency: respondingNotif?.urgency
                }}
                onConfirm={handleConfirmResponse}
                onCancel={() => { setModalOpen(false); setRespondingNotif(null); }}
                loading={respondLoading}
            />
        </div>
    );
};

export default NotificationPanel;
