const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Donor = require('../models/Donor');

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new donor
// @route   POST /api/donors/register
// @access  Public
const registerDonor = async (req, res) => {
    try {
        const { name, email, password, bloodType, city, area, phone, medicalFlags } = req.body;

        // Validate password length before hashing
        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Check if donor already exists
        const existingDonor = await Donor.findOne({ email });
        if (existingDonor) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create donor
        const donor = await Donor.create({
            name,
            email,
            password: hashedPassword,
            bloodType,
            city,
            area,
            phone,
            medicalFlags
        });

        res.status(201).json({
            _id: donor._id,
            name: donor.name,
            email: donor.email,
            bloodType: donor.bloodType,
            role: donor.role,
            token: generateToken(donor._id)
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Login donor
// @route   POST /api/donors/login
// @access  Public
const loginDonor = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find donor by email
        const donor = await Donor.findOne({ email });
        if (!donor) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check if suspended
        if (donor.isSuspended) {
            return res.status(403).json({ message: 'Account is suspended. Contact admin.' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, donor.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.json({
            _id: donor._id,
            name: donor.name,
            email: donor.email,
            bloodType: donor.bloodType,
            city: donor.city,
            donationCount: donor.donationCount,
            isAvailable: donor.isAvailable,
            nextEligibleDate: donor.nextEligibleDate,
            lastDonationDate: donor.lastDonationDate,
            isVerified: donor.isVerified,
            badges: donor.badges,
            role: donor.role,
            token: generateToken(donor._id)
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get donor profile
// @route   GET /api/donors/:id
// @access  Private
const getDonorProfile = async (req, res) => {
    try {
        const donor = await Donor.findById(req.params.id).select('-password');
        if (!donor) {
            return res.status(404).json({ message: 'Donor not found' });
        }
        res.json(donor);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update donor profile
// @route   PUT /api/donors/:id
// @access  Private
const updateDonorProfile = async (req, res) => {
    try {
        const { name, city, area, phone, medicalFlags } = req.body;

        // Authorization: only allow users to edit their own profile
        if (req.user._id.toString() !== req.params.id) {
            return res.status(403).json({ message: 'Not authorized to edit this profile' });
        }

        const donor = await Donor.findById(req.params.id);
        if (!donor) {
            return res.status(404).json({ message: 'Donor not found' });
        }

        // Only allow updating specific fields (not email, bloodType, password)
        if (name) donor.name = name;
        if (city) donor.city = city;
        if (area) donor.area = area;
        if (phone) donor.phone = phone;
        if (medicalFlags) donor.medicalFlags = medicalFlags;

        await donor.save();
        res.json(donor);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Toggle donor availability (with 56-day enforcement)
// @route   PUT /api/donors/:id/availability
// @access  Private
const toggleAvailability = async (req, res) => {
    try {
        const donor = await Donor.findById(req.params.id);
        if (!donor) {
            return res.status(404).json({ message: 'Donor not found' });
        }

        // Authorization: only allow donors to toggle their own availability
        if (req.user._id.toString() !== req.params.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const today = new Date();

        // If trying to enable availability, check 56-day rule
        if (req.body.isAvailable === true && donor.nextEligibleDate && donor.nextEligibleDate > today) {
            const daysRemaining = Math.ceil((donor.nextEligibleDate - today) / (1000 * 60 * 60 * 24));
            return res.status(400).json({
                message: 'Not eligible yet. 56-day cooldown in effect.',
                nextEligibleDate: donor.nextEligibleDate,
                daysRemaining
            });
        }

        donor.isAvailable = req.body.isAvailable;
        await donor.save();

        res.json({
            success: true,
            isAvailable: donor.isAvailable,
            nextEligibleDate: donor.nextEligibleDate
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Apply for verification
// @route   POST /api/donors/:id/verify
// @access  Private
const applyForVerification = async (req, res) => {
    try {
        const donor = await Donor.findById(req.params.id);
        if (!donor) {
            return res.status(404).json({ message: 'Donor not found' });
        }

        // Authorization: only allow donors to apply for their own verification
        if (req.user._id.toString() !== req.params.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (donor.verificationStatus === 'pending') {
            return res.status(400).json({ message: 'Verification already pending' });
        }
        if (donor.verificationStatus === 'verified') {
            return res.status(400).json({ message: 'Already verified' });
        }

        donor.verificationStatus = 'pending';
        if (req.body.documentPath) {
            donor.verificationDocument = req.body.documentPath;
        }
        await donor.save();

        res.json({ message: 'Verification request submitted', verificationStatus: donor.verificationStatus });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Search donors (for map / listing)
// @route   GET /api/donors/search
// @access  Private
const searchDonors = async (req, res) => {
    try {
        const { bloodType, city, isAvailable } = req.query;
        const query = { isSuspended: false };

        if (bloodType) query.bloodType = bloodType;
        if (city) query.city = city;
        if (isAvailable !== undefined) query.isAvailable = isAvailable === 'true';

        const donors = await Donor.find(query)
            .select('-password')
            .sort({ isVerified: -1 });

        res.json(donors);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    registerDonor,
    loginDonor,
    getDonorProfile,
    updateDonorProfile,
    toggleAvailability,
    applyForVerification,
    searchDonors
};
