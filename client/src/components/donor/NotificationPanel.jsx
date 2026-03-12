import React from 'react';
import NotificationCard from './NotificationCard';

const NotificationPanel = ({ notifications, loading, onMarkRead, onMarkAll, onRespond }) => {
    return (
        <div className="notif-panel">
            <div className="notif-panel-header">
                <h3>🔔 Notifications</h3>
                {notifications.some(n => !n.isRead) && (
                    <button className="notif-mark-all-btn" onClick={onMarkAll}>
                        Mark all read
                    </button>
                )}
            </div>

            <div className="notif-panel-body">
                {loading ? (
                    <div className="notif-empty">
                        <span className="notif-empty-icon">⏳</span>
                        <p>Loading notifications...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="notif-empty">
                        <span className="notif-empty-icon">🔕</span>
                        <p>No notifications yet</p>
                    </div>
                ) : (
                    notifications.map(n => (
                        <NotificationCard
                            key={n._id}
                            notification={n}
                            onMarkRead={onMarkRead}
                            onRespond={onRespond}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationPanel;
