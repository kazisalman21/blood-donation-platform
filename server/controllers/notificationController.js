/**
 * NotificationController — Controller layer for Feature 3 (Donor Notifications)
 * Owner: Kazi Salman Salim (23101209)
 * Model: Notification.js
 * Routes: donorRoutes.js
 *
 * SRS Requirements:
 * FR-3.3: Donor can view all notifications
 * FR-3.4: Notification shows read/unread state
 * FR-3.5: Donor can mark notifications as read
 */

const Notification = require('../models/Notification');

// @desc    Get all notifications for a donor
// @route   GET /api/donors/:id/notifications
// @access  Private
const getNotifications = async (req, res) => {
    try {
        // Authorization: only allow donors to fetch their own notifications
        if (req.user._id.toString() !== req.params.id) {
            return res.status(403).json({ message: 'Not authorized to view these notifications' });
        }

        const notifications = await Notification.find({ donorId: req.params.id })
            .populate('requestId', 'bloodType hospital urgency status')
            .sort({ createdAt: -1 });

        const unreadCount = await Notification.countDocuments({
            donorId: req.params.id,
            isRead: false
        });

        res.json({ notifications, unreadCount });
    } catch (error) {
        console.error('Failed to fetch notifications:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get unread notification count for a donor (lightweight for badge polling)
// @route   GET /api/donors/:id/notifications/count
// @access  Private
const getUnreadCount = async (req, res) => {
    try {
        // Authorization: only allow donors to fetch their own count
        if (req.user._id.toString() !== req.params.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const unreadCount = await Notification.countDocuments({
            donorId: req.params.id,
            isRead: false
        });

        res.json({ unreadCount });
    } catch (error) {
        console.error('Failed to fetch unread count:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Mark a single notification as read
// @route   PUT /api/donors/notifications/:notifId/read
// @access  Private
const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.notifId);

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        // Authorization: notification must belong to the authenticated donor
        if (notification.donorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to modify this notification' });
        }

        notification.isRead = true;
        await notification.save();

        res.json(notification);
    } catch (error) {
        console.error('Failed to mark notification as read:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Mark all notifications as read for a donor
// @route   PUT /api/donors/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
    try {
        const result = await Notification.updateMany(
            { donorId: req.user._id, isRead: false },
            { $set: { isRead: true } }
        );

        res.json({ modifiedCount: result.modifiedCount });
    } catch (error) {
        console.error('Failed to mark all notifications as read:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead
};
