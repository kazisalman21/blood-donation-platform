const Donor = require('../models/Donor');
const BloodRequest = require('../models/BloodRequest');
const Donation = require('../models/Donation');
const FAQ = require('../models/FAQ');
const AlertLog = require('../models/AlertLog');
const { getCompatibleDonorTypes } = require('../utils/bloodCompatibility');

// ==================== USER MANAGEMENT ====================

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = async (req, res) => {
    try {
        const { role, status, search } = req.query;
        const query = {};

        if (role) query.role = role;
        if (status === 'suspended') query.isSuspended = true;
        if (status === 'active') query.isSuspended = false;
        if (status === 'verified') query.verificationStatus = 'verified';
        if (status === 'pending') query.verificationStatus = 'pending';

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await Donor.find(query).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Suspend/unsuspend a user
// @route   PUT /api/admin/users/:id/suspend
// @access  Admin
const suspendUser = async (req, res) => {
    try {
        // Bug Fix: prevent admin from suspending themselves (self-lockout)
        if (req.user._id.toString() === req.params.id) {
            return res.status(400).json({ message: 'Cannot suspend your own account' });
        }

        const user = await Donor.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isSuspended = !user.isSuspended;
        await user.save();

        res.json({
            message: user.isSuspended ? 'User suspended' : 'User unsuspended',
            isSuspended: user.isSuspended
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Approve or reject verification
// @route   PUT /api/admin/users/:id/verify
// @access  Admin
const approveVerification = async (req, res) => {
    try {
        const { action } = req.body; // 'approve' or 'reject'

        // Bug Fix (M2): validate action parameter
        if (!action || !['approve', 'reject'].includes(action)) {
            return res.status(400).json({ message: "Action must be 'approve' or 'reject'" });
        }

        const user = await Donor.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.verificationStatus !== 'pending') {
            return res.status(400).json({ message: 'No pending verification request' });
        }

        if (action === 'approve') {
            user.verificationStatus = 'verified';
            user.isVerified = true;
        } else {
            user.verificationStatus = 'rejected';
        }

        await user.save();
        res.json({ message: `Verification ${action}d`, verificationStatus: user.verificationStatus });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// ==================== BLOOD INVENTORY ====================

// @desc    Get blood inventory (donor counts by blood type per city)
// @route   GET /api/admin/inventory
// @access  Admin
const getBloodInventory = async (req, res) => {
    try {
        const { city } = req.query;
        const matchStage = { isAvailable: true, isSuspended: false };
        if (city) matchStage.city = city;

        const inventory = await Donor.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$bloodType',
                    count: { $sum: 1 },
                    verifiedCount: {
                        $sum: { $cond: ['$isVerified', 1, 0] }
                    }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Get list of cities for the filter
        const cities = await Donor.distinct('city', { city: { $ne: null } });

        res.json({ inventory, cities });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// ==================== ANALYTICS ====================

// @desc    Get requests per week (last 8 weeks)
// @route   GET /api/admin/analytics/requests
// @access  Admin
const getRequestAnalytics = async (req, res) => {
    try {
        const eightWeeksAgo = new Date();
        eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);

        const data = await BloodRequest.aggregate([
            { $match: { createdAt: { $gte: eightWeeksAgo } } },
            {
                $group: {
                    _id: { $isoWeek: '$createdAt' },
                    count: { $sum: 1 },
                    year: { $first: { $isoWeekYear: '$createdAt' } }
                }
            },
            { $sort: { year: 1, _id: 1 } }
        ]);

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get donations by city
// @route   GET /api/admin/analytics/donations
// @access  Admin
const getDonationAnalytics = async (req, res) => {
    try {
        const data = await Donation.aggregate([
            { $match: { status: 'Completed' } },
            { $group: { _id: '$location', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get match rate by blood type
// @route   GET /api/admin/analytics/matchrate
// @access  Admin
const getMatchRate = async (req, res) => {
    try {
        const data = await BloodRequest.aggregate([
            {
                $group: {
                    _id: '$bloodType',
                    total: { $sum: 1 },
                    matched: {
                        $sum: { $cond: [{ $ne: ['$matchedDonorId', null] }, 1, 0] }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    total: 1,
                    matched: 1,
                    rate: {
                        $cond: [
                            { $gt: ['$total', 0] },
                            { $multiply: [{ $divide: ['$matched', '$total'] }, 100] },
                            0
                        ]
                    }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get average donor response time
// @route   GET /api/admin/analytics/responsetime
// @access  Admin
const getResponseTime = async (req, res) => {
    try {
        const requests = await BloodRequest.find({
            matchedDonorId: { $ne: null },
            'statusHistory.1': { $exists: true } // has at least 2 status entries
        });

        let totalTime = 0;
        let count = 0;

        // Bug Fix (M4): renamed from 'req' to 'request' to avoid variable shadowing
        requests.forEach(request => {
            const openEntry = request.statusHistory.find(s => s.stage === 'Open');
            const matchEntry = request.statusHistory.find(s => s.stage === 'Donor Matched');
            if (openEntry && matchEntry) {
                totalTime += (matchEntry.timestamp - openEntry.timestamp);
                count++;
            }
        });

        const avgTimeMs = count > 0 ? totalTime / count : 0;
        const avgTimeHours = (avgTimeMs / (1000 * 60 * 60)).toFixed(1);

        res.json({ averageResponseTimeHours: parseFloat(avgTimeHours), totalMatched: count });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// ==================== BROADCAST ====================

// @desc    Send broadcast emergency alert
// @route   POST /api/admin/broadcast
// @access  Admin
const sendBroadcast = async (req, res) => {
    try {
        const { bloodType, city, message } = req.body;

        // Bug Fix (M3): validate required fields
        if (!bloodType || !['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(bloodType)) {
            return res.status(400).json({ message: 'Valid blood type is required' });
        }
        if (!city || city.trim().length === 0) {
            return res.status(400).json({ message: 'City is required' });
        }

        if (!message || message.length > 200) {
            return res.status(400).json({ message: 'Message is required and must be 200 chars or less' });
        }

        const compatTypes = getCompatibleDonorTypes(bloodType);
        const donors = await Donor.find({
            bloodType: { $in: compatTypes },
            city,
            isAvailable: true,
            isSuspended: false
        });

        // In production, send emails via Nodemailer here
        // for (const donor of donors) {
        //   await sendBroadcastEmail(donor.email, donor.name, message);
        // }

        const log = await AlertLog.create({
            bloodType,
            city,
            message,
            donorsNotified: donors.length,
            sentBy: req.user._id
        });

        res.json({ success: true, notified: donors.length, log });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get broadcast history
// @route   GET /api/admin/broadcast/history
// @access  Admin
const getBroadcastHistory = async (req, res) => {
    try {
        const history = await AlertLog.find()
            .populate('sentBy', 'name email')
            .sort({ createdAt: -1 }); // Bug Fix: sentAt removed, use timestamps.createdAt

        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// ==================== FAQ MANAGEMENT ====================

// @desc    Create FAQ
// @route   POST /api/admin/faqs
// @access  Admin
const createFAQ = async (req, res) => {
    try {
        // Bug Fix: whitelist allowed fields to prevent mass assignment
        const { question, answer, category, order, isActive } = req.body;
        const faq = await FAQ.create({ question, answer, category, order, isActive });
        res.status(201).json(faq);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update FAQ
// @route   PUT /api/admin/faqs/:id
// @access  Admin
const updateFAQ = async (req, res) => {
    try {
        // Bug Fix: whitelist allowed fields to prevent mass assignment
        const { question, answer, category, order, isActive } = req.body;
        const updateData = {};
        if (question !== undefined) updateData.question = question;
        if (answer !== undefined) updateData.answer = answer;
        if (category !== undefined) updateData.category = category;
        if (order !== undefined) updateData.order = order;
        if (isActive !== undefined) updateData.isActive = isActive;

        const faq = await FAQ.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!faq) return res.status(404).json({ message: 'FAQ not found' });
        res.json(faq);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete FAQ
// @route   DELETE /api/admin/faqs/:id
// @access  Admin
const deleteFAQ = async (req, res) => {
    try {
        const faq = await FAQ.findByIdAndDelete(req.params.id);
        if (!faq) return res.status(404).json({ message: 'FAQ not found' });
        res.json({ message: 'FAQ deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAllUsers,
    suspendUser,
    approveVerification,
    getBloodInventory,
    getRequestAnalytics,
    getDonationAnalytics,
    getMatchRate,
    getResponseTime,
    sendBroadcast,
    getBroadcastHistory,
    createFAQ,
    updateFAQ,
    deleteFAQ
};
