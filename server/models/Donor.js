const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6
    },
    bloodType: {
        type: String,
        required: [true, 'Blood type is required'],
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    city: {
        type: String,
        trim: true
    },
    area: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    medicalFlags: {
        diabetic: { type: Boolean, default: false },
        onMedication: { type: Boolean, default: false },
        recentSurgery: { type: Boolean, default: false }
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationStatus: {
        type: String,
        enum: ['none', 'pending', 'verified', 'rejected'],
        default: 'none'
    },
    verificationDocument: {
        type: String // file path
    },
    lastDonationDate: {
        type: Date,
        default: null
    },
    nextEligibleDate: {
        type: Date,
        default: null
    },
    donationCount: {
        type: Number,
        default: 0
    },
    badges: {
        type: [String],
        default: []
    },
    role: {
        type: String,
        enum: ['donor', 'admin'],
        default: 'donor'
    },
    coordinates: {
        lat: { type: Number },
        lng: { type: Number }
    },
    isSuspended: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Donor', donorSchema);
