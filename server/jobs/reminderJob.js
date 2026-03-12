/**
 * Daily Eligibility Reminder Cron Job — Feature 14
 * Owner: Miskatul Afrin Anika
 * Controller: N/A (scheduled job, not triggered by user)
 * Model: Donor.js (nextEligibleDate, isAvailable, isSuspended)
 * 
 * SRS Requirements:
 * FR-14.1: Runs daily at 8:00 AM via node-cron
 * FR-14.2: Sends emails to donors whose nextEligibleDate is within 2 days
 */
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Donor = require('../models/Donor');

// Health tips to include in emails (same array as frontend HealthTipsSection)
const EMAIL_TIPS = [
    'Stay hydrated — drink at least 16 oz of water before donating.',
    'Eat iron-rich foods like spinach, red meat, and lentils to recover faster.',
    'Get 7-8 hours of sleep the night before donating blood.',
    'Avoid caffeine on donation day — it can dehydrate you.',
    'Light walking is fine after donating, but skip heavy exercise for 24 hours.',
    'Eat bananas or potatoes for potassium to prevent dizziness.',
    'Every donation includes a free mini health screening!',
    'Regular blood donation may lower the risk of heart disease.',
];

// Configure Nodemailer transport using environment variables
const createTransport = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// Send styled HTML reminder email (SRS FR-14.2)
const sendReminderEmail = async (transporter, donor) => {
    const eligibleDate = new Date(donor.nextEligibleDate).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric'
    });

    // Pick a random health tip for the email
    const tip = EMAIL_TIPS[Math.floor(Math.random() * EMAIL_TIPS.length)];

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #1a1a2e; color: #fff; border-radius: 12px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #ef5350, #c62828); padding: 1.5rem; text-align: center;">
                <h1 style="margin: 0; font-size: 1.3rem;">🩸 BloodConnect</h1>
                <p style="margin: 0.5rem 0 0; opacity: 0.9; font-size: 0.85rem;">Eligibility Reminder</p>
            </div>
            <div style="padding: 1.5rem;">
                <p>Hi <strong>${donor.name}</strong>,</p>
                <p>Great news! You'll be eligible to donate blood again on <strong>${eligibleDate}</strong>.</p>
                <p>Your generosity saves lives. When you're ready, log in to BloodConnect and check for pending blood requests in your area.</p>
                <div style="background: rgba(255,255,255,0.05); border-left: 3px solid #64b5f6; padding: 0.8rem; margin: 1rem 0; border-radius: 0 6px 6px 0;">
                    <strong style="color: #64b5f6;">💡 Health Tip:</strong>
                    <p style="margin: 0.3rem 0 0; opacity: 0.8; font-size: 0.9rem;">${tip}</p>
                </div>
                <p style="opacity: 0.6; font-size: 0.8rem;">— The BloodConnect Team</p>
            </div>
        </div>
    `;

    try {
        await transporter.sendMail({
            from: `"BloodConnect" <${process.env.EMAIL_USER}>`,
            to: donor.email,
            subject: `🩸 You're almost eligible to donate again!`,
            html: htmlContent
        });
        console.log(`📧 Reminder sent to ${donor.name} (${donor.email})`);
    } catch (err) {
        console.error(`❌ Failed to send to ${donor.email}:`, err.message);
    }
};

// Main cron job (SRS FR-14.1: daily at 8:00 AM)
const startReminderJob = () => {
    cron.schedule('0 8 * * *', async () => {
        try {
            console.log('⏰ Running daily eligibility reminder check...');

            const startOfTwoDays = new Date();
            startOfTwoDays.setDate(startOfTwoDays.getDate() + 2);
            startOfTwoDays.setHours(0, 0, 0, 0);

            const endOfTwoDays = new Date();
            endOfTwoDays.setDate(endOfTwoDays.getDate() + 2);
            endOfTwoDays.setHours(23, 59, 59, 999);

            // Find donors approaching eligibility exactly 2 days from now (SRS FR-14.2)
            const donors = await Donor.find({
                nextEligibleDate: { $gte: startOfTwoDays, $lte: endOfTwoDays },
                isAvailable: false,
                isSuspended: false
            });

            console.log(`Found ${donors.length} donors approaching eligibility`);

            if (donors.length > 0 && process.env.EMAIL_USER) {
                const transporter = createTransport();
                for (const donor of donors) {
                    await sendReminderEmail(transporter, donor);
                }
            } else if (!process.env.EMAIL_USER) {
                console.log('⚠️ EMAIL_USER not configured — skipping email send');
            }
        } catch (error) {
            console.error('❌ Reminder job error:', error.message);
        }
    });

    console.log('✅ Eligibility reminder cron job scheduled (daily at 8:00 AM)');
};

module.exports = { startReminderJob };

