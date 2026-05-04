const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
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
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    message: {
        type: String,
        maxlength: 300,
        trim: true
    },
    allowPublic: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Bug Fix: prevent duplicate feedback — one feedback per request per donor
feedbackSchema.index({ requestId: 1, donorId: 1 }, { unique: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
