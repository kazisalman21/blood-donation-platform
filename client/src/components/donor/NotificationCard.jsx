import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const NotificationCard = ({ notification, onMarkRead, onRespond }) => {
    const { token } = useAuth();
    const [responding, setResponding] = useState(false);
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

    const handleRespond = async (accept) => {
        if (!notification.requestId) return;
        setResponding(true);
        try {
            const res = await fetch(`${API}/api/requests/${notification.requestId}/respond`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ accept })
            });
            if (res.ok) {
                setResponse(accept ? 'accepted' : 'declined');
                onMarkRead(notification._id);
                if (onRespond) onRespond(notification.requestId, accept);
            }
        } catch (err) {
            console.error('Failed to respond to request:', err);
        } finally {
            setResponding(false);
        }
    };

    return (
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

            {/* Accept / Decline buttons — only if no response yet */}
            {notification.requestId && !response && (
                <div className="notif-actions">
                    <button
                        className="notif-btn-accept"
                        onClick={() => handleRespond(true)}
                        disabled={responding}
                    >
                        {responding ? '...' : '✓ Accept'}
                    </button>
                    <button
                        className="notif-btn-decline"
                        onClick={() => handleRespond(false)}
                        disabled={responding}
                    >
                        {responding ? '...' : '✕ Decline'}
                    </button>
                </div>
            )}

            {response && (
                <span className={`notif-responded ${response}`}>
                    {response === 'accepted' ? '✓ You accepted this request' : '✕ You declined this request'}
                </span>
            )}
        </div>
    );
};

export default NotificationCard;
