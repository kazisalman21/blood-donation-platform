const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
    requesterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donor',
        required: true
    },
    bloodType: {
        type: String,
        required: [true, 'Blood type is required'],
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    unitsNeeded: {
        type: Number,
        required: [true, 'Units needed is required'],
        min: 1,
        max: 10
    },
    hospital: {
        type: String,
        required: [true, 'Hospital name is required'],
        trim: true
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    urgency: {
        type: String,
        enum: ['Critical', 'Urgent', 'Normal'],
        default: 'Normal'
    },
    status: {
        type: String,
        default: 'Open',
        enum: [
            'Open',
            'Donors Notified',
            'Donor Matched',
            'Contact Shared',
            'Scheduled',
            'Completed'
        ]
    },
    statusHistory: [{
        stage: { type: String },
        timestamp: { type: Date, default: Date.now }
    }],
    matchedDonorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donor',
        default: null
    },
    donorConsent: {
        type: Boolean,
        default: false
    },
    requesterConsent: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Automatically add first status entry on creation
bloodRequestSchema.pre('save', function (next) {
    if (this.isNew) {
        this.statusHistory.push({ stage: 'Open', timestamp: new Date() });
    }
    next();
});

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
