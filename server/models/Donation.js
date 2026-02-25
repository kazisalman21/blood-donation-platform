const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donor',
        required: true
    },
    requestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BloodRequest',
        required: true
    },
    donationDate: {
        type: Date,
        default: Date.now
    },
    bloodType: {
        type: String,
        required: true
    },
    location: {
        type: String,
        trim: true
    },
    recipientAnonymized: {
        type: String // 'Patient #' + random 4-digit number
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Cancelled'],
        default: 'Scheduled'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Donation', donationSchema);
