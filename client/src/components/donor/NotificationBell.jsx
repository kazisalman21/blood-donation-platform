/**
 * NotificationBell — View layer for Feature 3 (Notifications)
 * Owner: Kazi Salman Salim (23101209)
 * Controller: notificationController.getUnreadCount()
 * Model: Notification.js
 *
 * SRS Requirements:
 * FR-3.3: Donor can view all notifications
 * FR-3.4: Notification shows read/unread state
 *
 * Displays a bell icon in the Navbar with unread count badge.
 * Polls the server every 30 seconds for updated count.
 * Clicking the bell toggles the NotificationPanel.
 */

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import NotificationPanel from './NotificationPanel';
import './Notification.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const NotificationBell = () => {
    const { user, token } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);
    const [panelOpen, setPanelOpen] = useState(false);
    const [pulse, setPulse] = useState(false);

    // Fetch unread count from server
    const fetchUnreadCount = useCallback(async () => {
        if (!user || !token) return;
        try {
            const res = await axios.get(`${API_URL}/donors/${user._id}/notifications/count`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const newCount = res.data.unreadCount;

            // Pulse animation when count increases
            if (newCount > unreadCount && unreadCount !== 0) {
                setPulse(true);
                setTimeout(() => setPulse(false), 600);
            }

            setUnreadCount(newCount);
        } catch (err) {
            console.error('Failed to fetch notification count:', err);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, token]);

    // Poll every 30 seconds
    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, [fetchUnreadCount]);

    // Toggle panel
    const handleToggle = () => {
        setPanelOpen(prev => !prev);
    };

    // Called when notifications are marked as read in the panel
    const handleCountUpdate = (newCount) => {
        setUnreadCount(newCount);
    };

    if (!user) return null;

    return (
        <>
            <button
                className={`notification-bell ${pulse ? 'bell-pulse' : ''}`}
                onClick={handleToggle}
                aria-label="Notifications"
                title="Notifications"
            >
                {/* Bell SVG icon — matches Navbar icon style */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadCount > 0 && (
                    <span className="notification-badge">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Panel (slide-out) */}
            <NotificationPanel
                isOpen={panelOpen}
                onClose={() => setPanelOpen(false)}
                onCountUpdate={handleCountUpdate}
            />

            {/* Overlay when panel is open */}
            {panelOpen && (
                <div
                    className="notification-overlay"
                    onClick={() => setPanelOpen(false)}
                />
            )}
        </>
    );
};

export default NotificationBell;
