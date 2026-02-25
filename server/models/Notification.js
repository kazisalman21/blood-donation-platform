const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
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
    message: {
        type: String,
        required: true
    },
    bloodType: {
        type: String
    },
    hospital: {
        type: String
    },
    urgency: {
        type: String,
        enum: ['Critical', 'Urgent', 'Normal']
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
