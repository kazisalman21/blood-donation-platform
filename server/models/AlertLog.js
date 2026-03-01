const mongoose = require('mongoose');

const alertLogSchema = new mongoose.Schema({
    bloodType: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true,
        maxlength: 200
    },
    donorsNotified: {
        type: Number,
        default: 0
    },
    sentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donor',
        required: true
    },
    sentAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('AlertLog', alertLogSchema);
