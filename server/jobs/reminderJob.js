const cron = require('node-cron');
const Donor = require('../models/Donor');
// const nodemailer = require('nodemailer');

/**
 * Daily Eligibility Reminder Job
 * Runs every day at 8:00 AM
 * Finds donors whose nextEligibleDate is within 2 days
 * Sends reminder emails (Nodemailer integration in Sprint 2)
 */

const sendReminderEmail = async (email, name, nextEligibleDate) => {
    // TODO: Configure Nodemailer transport in Sprint 2
    console.log(`📧 Reminder email queued for ${name} (${email}) - eligible on ${nextEligibleDate}`);
};

const startReminderJob = () => {
    // Runs every day at 8:00 AM
    cron.schedule('0 8 * * *', async () => {
        try {
            console.log('⏰ Running daily eligibility reminder check...');

            const twoDaysFromNow = new Date();
            twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);

            const donors = await Donor.find({
                nextEligibleDate: { $lte: twoDaysFromNow },
                isAvailable: false,
                isSuspended: false
            });

            console.log(`Found ${donors.length} donors approaching eligibility`);

            for (const donor of donors) {
                await sendReminderEmail(donor.email, donor.name, donor.nextEligibleDate);
            }
        } catch (error) {
            console.error('❌ Reminder job error:', error.message);
        }
    });

    console.log('✅ Eligibility reminder cron job scheduled (daily at 8:00 AM)');
};

module.exports = { startReminderJob };
