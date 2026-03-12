import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import ConsentModal from '../shared/ConsentModal';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const NotificationCard = ({ notification, onMarkRead, onRespond }) => {
    const { token } = useAuth();
    const [showConsent, setShowConsent] = useState(false);
    const [declining, setDeclining] = useState(false);
    const [response, setResponse] = useState(notification.response || null);

    const timeAgo = (dateStr) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'just now';
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
    };

    const handleDecline = async () => {
        if (!notification.requestId) return;
        setDeclining(true);
        try {
            const res = await fetch(`${API}/api/requests/${notification.requestId}/respond`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ accept: false })
            });
            if (res.ok) {
                setResponse('declined');
                onMarkRead(notification._id);
                if (onRespond) onRespond(notification.requestId, false);
            }
        } catch (err) {
            console.error('Failed to decline request:', err);
        } finally {
            setDeclining(false);
        }
    };

    const handleConsentConfirmed = (updatedRequest) => {
        setShowConsent(false);
        setResponse('accepted');
        onMarkRead(notification._id);
        if (onRespond) onRespond(notification.requestId, true);
    };

    return (
        <>
            <div className={`notif-card ${!notification.isRead ? 'unread' : ''}`}>
                <div className="notif-card-top">
                    <span className={`notif-urgency-dot ${notification.urgency || 'Normal'}`} />
                    <div className="notif-card-content">
                        <p className="notif-message">{notification.message}</p>
                        <div className="notif-meta">
                            {notification.bloodType && (
                                <span className="notif-blood-badge">{notification.bloodType}</span>
                            )}
                            <span className="notif-time">{timeAgo(notification.createdAt)}</span>
                        </div>
                    </div>
                    {!notification.isRead && <span className="notif-unread-dot" />}
                </div>

                {/* Accept opens ConsentModal; Decline calls API directly */}
                {notification.requestId && !response && (
                    <div className="notif-actions">
                        <button
                            className="notif-btn-accept"
                            onClick={() => setShowConsent(true)}
                        >
                            ✓ Accept
                        </button>
                        <button
                            className="notif-btn-decline"
                            onClick={handleDecline}
                            disabled={declining}
                        >
                            {declining ? '...' : '✕ Decline'}
                        </button>
                    </div>
                )}

                {response && (
                    <span className={`notif-responded ${response}`}>
                        {response === 'accepted' ? '✓ You accepted this request' : '✕ You declined this request'}
                    </span>
                )}
            </div>

            {/* Consent Modal — shown only when donor clicks Accept */}
            {showConsent && (
                <ConsentModal
                    requestId={notification.requestId}
                    requestInfo={{
                        bloodType: notification.bloodType,
                        hospital: notification.hospital,
                        urgency: notification.urgency
                    }}
                    onConfirm={handleConsentConfirmed}
                    onCancel={() => setShowConsent(false)}
                />
            )}
        </>
    );
};

export default NotificationCard;
