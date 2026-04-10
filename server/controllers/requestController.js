const BloodRequest = require('../models/BloodRequest');
const Notification = require('../models/Notification');
const Donation = require('../models/Donation');
const Donor = require('../models/Donor');
const { findEligibleDonors } = require('../utils/bloodCompatibility');

// @desc    Create a new blood request
// @route   POST /api/requests
// @access  Private
const createRequest = async (req, res) => {
    try {
        const { bloodType, unitsNeeded, hospital, location, urgency } = req.body;

        const request = await BloodRequest.create({
            requesterId: req.user._id,
            bloodType,
            unitsNeeded,
            hospital,
            location,
            urgency
        });

        // Run matching algorithm — find eligible donors
        const eligibleDonors = await findEligibleDonors(bloodType, location);

        // Create notifications for eligible donors
        if (eligibleDonors.length > 0) {
            const notifications = eligibleDonors.map(donor => ({
                donorId: donor._id,
                requestId: request._id,
                message: `Urgent ${urgency} blood request for ${bloodType} at ${hospital}`,
                bloodType,
                hospital,
                urgency
            }));

            await Notification.insertMany(notifications);

            // Update request status
            request.status = 'Donors Notified';
            request.statusHistory.push({ stage: 'Donors Notified', timestamp: new Date() });
            await request.save();
        }

        res.status(201).json({
            request,
            eligibleDonorsCount: eligibleDonors.length
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get a single request
// @route   GET /api/requests/:id
// @access  Private
const getRequest = async (req, res) => {
    try {
        const request = await BloodRequest.findById(req.params.id)
            .populate('requesterId', 'name bloodType city')
            .populate('matchedDonorId', 'name bloodType city isVerified');

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        res.json(request);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all requests (with filters)
// @route   GET /api/requests
// @access  Private
const getRequests = async (req, res) => {
    try {
        const { bloodType, urgency, status, city } = req.query;
        const query = {};

        if (bloodType) query.bloodType = bloodType;
        if (urgency) query.urgency = urgency;
        if (status) query.status = status;
        if (city) query.location = city;

        const requests = await BloodRequest.find(query)
            .populate('requesterId', 'name city')
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Donor responds to a request (accept/decline)
// @route   PUT /api/requests/:id/respond
// @access  Private
const respondToRequest = async (req, res) => {
    try {
        const { accept } = req.body;
        const request = await BloodRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        if (accept) {
            request.matchedDonorId = req.user._id;
            request.donorConsent = true;
            request.status = 'Donor Matched';
            request.statusHistory.push({ stage: 'Donor Matched', timestamp: new Date() });

            // F4: Notify the requester that a donor accepted their request
            const donor = await Donor.findById(req.user._id).select('name bloodType');
            await Notification.create({
                donorId: request.requesterId,  // Notification goes to the requester
                requestId: request._id,
                message: `${donor.name} (${donor.bloodType}) accepted your blood request for ${request.bloodType}`,
                bloodType: request.bloodType,
                hospital: request.hospital,
                urgency: request.urgency
            });
        }

        await request.save();

        res.json({
            message: accept ? 'Request accepted' : 'Request declined',
            request
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Requester acknowledges matched donor
// @route   PUT /api/requests/:id/consent
// @access  Private
const requesterConsent = async (req, res) => {
    try {
        const request = await BloodRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Verify the user is the requester
        if (request.requesterId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Only the requester can give consent' });
        }

        request.requesterConsent = true;

        // If both consents are now true, share contact
        if (request.donorConsent && request.requesterConsent) {
            request.status = 'Contact Shared';
            request.statusHistory.push({ stage: 'Contact Shared', timestamp: new Date() });
        }

        await request.save();
        res.json({ message: 'Consent given', request });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update request status
// @route   PUT /api/requests/:id/status
// @access  Private
const updateStatus = async (req, res) => {
    try {
        const { newStatus } = req.body;
        const validStatuses = ['Open', 'Donors Notified', 'Donor Matched', 'Contact Shared', 'Scheduled', 'Completed'];

        if (!validStatuses.includes(newStatus)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const request = await BloodRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Enforce linear progression — new status must be after current
        const currentIndex = validStatuses.indexOf(request.status);
        const newIndex = validStatuses.indexOf(newStatus);

        if (newIndex <= currentIndex) {
            return res.status(400).json({ message: 'Cannot move to a previous or same status' });
        }

        request.status = newStatus;
        request.statusHistory.push({ stage: newStatus, timestamp: new Date() });
        await request.save();

        // 🟢 FIX: If the request is completed, generate a permanent Donation record 
        // This is required for Anika's F5 (History) and F13 (Leaderboard) to work
        if (newStatus === 'Completed' && request.matchedDonorId) {
            await Donation.create({
                donorId: request.matchedDonorId,
                requestId: request._id,
                bloodType: request.bloodType,
                donationDate: new Date(),
                location: request.hospital + (request.location ? `, ${request.location}` : ''),
                recipientAnonymized: `Patient at ${request.hospital}`,
                status: 'Completed'
            });

            // Update donor stats + cooldown dates + availability
            await Donor.findByIdAndUpdate(request.matchedDonorId, {
                $inc: { donationCount: 1 },
                $set: {
                    lastDonationDate: new Date(),
                    nextEligibleDate: new Date(Date.now() + 56 * 24 * 60 * 60 * 1000),
                    isAvailable: false
                }
            });

            // Auto-assign badges based on new donation count
            const updatedDonor = await Donor.findById(request.matchedDonorId);
            const badgeThresholds = [
                { id: 'first_donation', threshold: 1 },
                { id: '5_donations', threshold: 5 },
                { id: '10_donations', threshold: 10 },
                { id: '25_donations', threshold: 25 },
                { id: '50_donations', threshold: 50 },
                { id: '100_donations', threshold: 100 }
            ];
            const earnedBadges = badgeThresholds
                .filter(b => updatedDonor.donationCount >= b.threshold)
                .map(b => b.id);
            if (earnedBadges.length > (updatedDonor.badges?.length || 0)) {
                updatedDonor.badges = earnedBadges;
                await updatedDonor.save();
            }
        }

        res.json({ message: 'Status updated', request });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get contact info (only if both consents are true)
// @route   GET /api/requests/:id/contact
// @access  Private
const getContactInfo = async (req, res) => {
    try {
        const request = await BloodRequest.findById(req.params.id)
            .populate('matchedDonorId', 'name email phone city')
            .populate('requesterId', 'name email phone city');

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Masking function — hand-written, no library
        const maskPhone = (phone) => {
            if (!phone || phone.length < 4) return '***';
            return phone.slice(0, 4) + '***-***' + phone.slice(-2);
        };

        const maskEmail = (email) => {
            if (!email) return '***';
            const [user, domain] = email.split('@');
            return user.slice(0, 2) + '***@' + domain;
        };

        // Only reveal real info if BOTH consents are true
        if (request.donorConsent && request.requesterConsent) {
            res.json({
                unlocked: true,
                donor: {
                    name: request.matchedDonorId?.name,
                    email: request.matchedDonorId?.email,
                    phone: request.matchedDonorId?.phone,
                    city: request.matchedDonorId?.city
                },
                requester: {
                    name: request.requesterId?.name,
                    email: request.requesterId?.email,
                    phone: request.requesterId?.phone,
                    city: request.requesterId?.city
                }
            });
        } else {
            res.json({
                unlocked: false,
                donor: {
                    name: request.matchedDonorId?.name,
                    email: maskEmail(request.matchedDonorId?.email),
                    phone: maskPhone(request.matchedDonorId?.phone),
                    city: request.matchedDonorId?.city
                },
                requester: {
                    name: request.requesterId?.name,
                    email: maskEmail(request.requesterId?.email),
                    phone: maskPhone(request.requesterId?.phone),
                    city: request.requesterId?.city
                },
                message: 'Both donor and requester must give consent to unlock contact details'
            });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createRequest,
    getRequest,
    getRequests,
    respondToRequest,
    requesterConsent,
    updateStatus,
    getContactInfo
};
