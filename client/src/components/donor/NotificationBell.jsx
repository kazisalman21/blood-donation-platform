import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import NotificationPanel from './NotificationPanel';
import './Notifications.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const POLL_INTERVAL = 30000; // poll every 30 seconds

const NotificationBell = () => {
    const { user, token } = useAuth();
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef(null);

    const fetchNotifications = useCallback(async () => {
        if (!user?._id || !token) return;
        try {
            const res = await fetch(`${API}/api/donors/${user._id}/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications || []);
                setUnreadCount(data.unreadCount || 0);
            }
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        }
    }, [user, token]);

    // Initial fetch + polling
    useEffect(() => {
        fetchNotifications();
        const timer = setInterval(fetchNotifications, POLL_INTERVAL);
        return () => clearInterval(timer);
    }, [fetchNotifications]);

    // Fetch when panel opens
    useEffect(() => {
        if (open) {
            setLoading(true);
            fetchNotifications().finally(() => setLoading(false));
        }
    }, [open, fetchNotifications]);

    // Close panel when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        if (open) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    const handleMarkRead = async (notifId) => {
        try {
            await fetch(`${API}/api/donors/notifications/${notifId}/read`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev =>
                prev.map(n => n._id === notifId ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
        }
    };

    const handleMarkAll = async () => {
        const unread = notifications.filter(n => !n.isRead);
        await Promise.all(unread.map(n => handleMarkRead(n._id)));
    };

    const handleRespond = () => {
        // Re-fetch after responding so status updates
        fetchNotifications();
    };

    return (
        <div className="notif-bell-wrapper" ref={wrapperRef}>
            <button
                className="notif-bell-btn"
                onClick={() => setOpen(prev => !prev)}
                aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadCount > 0 && (
                    <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
            </button>

            {open && (
                <NotificationPanel
                    notifications={notifications}
                    loading={loading}
                    onMarkRead={handleMarkRead}
                    onMarkAll={handleMarkAll}
                    onRespond={handleRespond}
                />
            )}
        </div>
    );
};

export default NotificationBell;
