/**
 * Database Seed Script — Blood Donation Platform
 * 
 * Creates realistic sample data for all 7 collections:
 * - 12 Donors (including 1 admin)
 * - 8 Blood Requests (various statuses)
 * - 6 Donations
 * - 15 Notifications
 * - 4 Feedbacks
 * - 6 FAQs
 * - 3 Alert Logs (broadcast history)
 * 
 * Usage:
 *   cd server
 *   node seed.js          # seed the database
 *   node seed.js --clear  # clear all data first, then seed
 * 
 * Default admin login:  admin@bloodconnect.com / admin123
 * Default donor login:  rahim.khan@gmail.com / donor123
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Models
const Donor = require('./models/Donor');
const BloodRequest = require('./models/BloodRequest');
const Donation = require('./models/Donation');
const Notification = require('./models/Notification');
const Feedback = require('./models/Feedback');
const FAQ = require('./models/FAQ');
const AlertLog = require('./models/AlertLog');

// ==================== SAMPLE DATA ====================

const hashPassword = async (pw) => bcrypt.hash(pw, 10);

const daysAgo = (n) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d;
};

const buildDonors = async () => {
    const pw = await hashPassword('donor123');
    const adminPw = await hashPassword('admin123');

    return [
        // ADMIN
        {
            name: 'Admin BloodConnect',
            email: 'admin@bloodconnect.com',
            password: adminPw,
            bloodType: 'O+',
            city: 'Dhaka',
            area: 'Gulshan',
            phone: '01700000000',
            role: 'admin',
            isAvailable: true,
            isVerified: true,
            verificationStatus: 'verified',
            donationCount: 5,
            badges: ['First Donation', 'Lifesaver'],
            lastDonationDate: daysAgo(90),
            nextEligibleDate: daysAgo(-10)
        },
        // DONORS
        {
            name: 'Rahim Khan',
            email: 'rahim.khan@gmail.com',
            password: pw,
            bloodType: 'A+',
            city: 'Dhaka',
            area: 'Dhanmondi',
            phone: '01711111111',
            isAvailable: true,
            isVerified: true,
            verificationStatus: 'verified',
            donationCount: 8,
            badges: ['First Donation', 'Lifesaver', '5 Donations'],
            lastDonationDate: daysAgo(60),
            nextEligibleDate: daysAgo(4)
        },
        {
            name: 'Fatima Akter',
            email: 'fatima.akter@gmail.com',
            password: pw,
            bloodType: 'B+',
            city: 'Dhaka',
            area: 'Uttara',
            phone: '01722222222',
            isAvailable: true,
            isVerified: true,
            verificationStatus: 'verified',
            donationCount: 3,
            badges: ['First Donation'],
            lastDonationDate: daysAgo(100),
            nextEligibleDate: daysAgo(-44)
        },
        {
            name: 'Karim Hossain',
            email: 'karim.hossain@gmail.com',
            password: pw,
            bloodType: 'O-',
            city: 'Chittagong',
            area: 'Agrabad',
            phone: '01733333333',
            isAvailable: true,
            isVerified: false,
            verificationStatus: 'pending',
            donationCount: 1,
            badges: ['First Donation'],
            lastDonationDate: daysAgo(200),
            nextEligibleDate: daysAgo(-144)
        },
        {
            name: 'Nusrat Jahan',
            email: 'nusrat.jahan@gmail.com',
            password: pw,
            bloodType: 'AB+',
            city: 'Sylhet',
            area: 'Zindabazar',
            phone: '01744444444',
            isAvailable: true,
            isVerified: true,
            verificationStatus: 'verified',
            donationCount: 6,
            badges: ['First Donation', 'Lifesaver', '5 Donations'],
            lastDonationDate: daysAgo(58),
            nextEligibleDate: daysAgo(2)
        },
        {
            name: 'Arif Rahman',
            email: 'arif.rahman@gmail.com',
            password: pw,
            bloodType: 'A-',
            city: 'Dhaka',
            area: 'Mirpur',
            phone: '01755555555',
            isAvailable: false,
            isVerified: false,
            verificationStatus: 'none',
            donationCount: 0,
            badges: [],
            medicalFlags: { diabetic: true, onMedication: false, recentSurgery: false }
        },
        {
            name: 'Sumaiya Islam',
            email: 'sumaiya.islam@gmail.com',
            password: pw,
            bloodType: 'B-',
            city: 'Rajshahi',
            area: 'Shaheb Bazar',
            phone: '01766666666',
            isAvailable: true,
            isVerified: true,
            verificationStatus: 'verified',
            donationCount: 4,
            badges: ['First Donation'],
            lastDonationDate: daysAgo(70),
            nextEligibleDate: daysAgo(-14)
        },
        {
            name: 'Tanvir Ahmed',
            email: 'tanvir.ahmed@gmail.com',
            password: pw,
            bloodType: 'O+',
            city: 'Dhaka',
            area: 'Banani',
            phone: '01777777777',
            isAvailable: true,
            isVerified: true,
            verificationStatus: 'verified',
            donationCount: 12,
            badges: ['First Donation', 'Lifesaver', '5 Donations', '10 Donations'],
            lastDonationDate: daysAgo(57),
            nextEligibleDate: daysAgo(1)
        },
        {
            name: 'Maliha Chowdhury',
            email: 'maliha.chowdhury@gmail.com',
            password: pw,
            bloodType: 'AB-',
            city: 'Khulna',
            area: 'Sonadanga',
            phone: '01788888888',
            isAvailable: true,
            isVerified: false,
            verificationStatus: 'none',
            donationCount: 2,
            badges: ['First Donation'],
            lastDonationDate: daysAgo(120),
            nextEligibleDate: daysAgo(-64)
        },
        {
            name: 'Imran Hasan',
            email: 'imran.hasan@gmail.com',
            password: pw,
            bloodType: 'A+',
            city: 'Chittagong',
            area: 'Nasirabad',
            phone: '01799999999',
            isAvailable: true,
            isVerified: true,
            verificationStatus: 'verified',
            donationCount: 7,
            badges: ['First Donation', 'Lifesaver', '5 Donations'],
            lastDonationDate: daysAgo(80),
            nextEligibleDate: daysAgo(-24)
        },
        {
            name: 'Riya Das',
            email: 'riya.das@gmail.com',
            password: pw,
            bloodType: 'B+',
            city: 'Dhaka',
            area: 'Mohakhali',
            phone: '01612345678',
            isAvailable: true,
            isVerified: false,
            verificationStatus: 'pending',
            donationCount: 1,
            badges: ['First Donation'],
            lastDonationDate: daysAgo(150),
            nextEligibleDate: daysAgo(-94)
        },
        {
            name: 'Sakib Al Hasan',
            email: 'sakib.hasan@gmail.com',
            password: pw,
            bloodType: 'O+',
            city: 'Comilla',
            area: 'Kandirpar',
            phone: '01698765432',
            isAvailable: true,
            isVerified: true,
            verificationStatus: 'verified',
            donationCount: 10,
            badges: ['First Donation', 'Lifesaver', '5 Donations', '10 Donations'],
            lastDonationDate: daysAgo(65),
            nextEligibleDate: daysAgo(-9)
        }
    ];
};

const buildRequests = (donors) => [
    {
        requesterId: donors[1]._id, // Rahim
        patientName: 'Anwar Hossain',
        contactNumber: '01811111111',
        bloodType: 'A+',
        unitsNeeded: 2,
        hospital: 'Dhaka Medical College Hospital',
        location: 'Dhaka',
        urgency: 'Critical',
        status: 'Completed',
        matchedDonorId: donors[9]._id, // Imran
        donorConsent: true,
        requesterConsent: true,
        compatibleDonorsCount: 4,
        statusHistory: [
            { stage: 'Open', timestamp: daysAgo(30) },
            { stage: 'Donors Notified', timestamp: daysAgo(30) },
            { stage: 'Donor Matched', timestamp: daysAgo(29) },
            { stage: 'Contact Shared', timestamp: daysAgo(29) },
            { stage: 'Scheduled', timestamp: daysAgo(28) },
            { stage: 'Completed', timestamp: daysAgo(27) }
        ]
    },
    {
        requesterId: donors[4]._id, // Nusrat
        patientName: 'Rashida Begum',
        contactNumber: '01822222222',
        bloodType: 'AB+',
        unitsNeeded: 1,
        hospital: 'Sylhet MAG Osmani Medical College',
        location: 'Sylhet',
        urgency: 'Urgent',
        status: 'Donor Matched',
        matchedDonorId: donors[8]._id, // Maliha
        donorConsent: true,
        requesterConsent: false,
        compatibleDonorsCount: 2,
        statusHistory: [
            { stage: 'Open', timestamp: daysAgo(5) },
            { stage: 'Donors Notified', timestamp: daysAgo(5) },
            { stage: 'Donor Matched', timestamp: daysAgo(4) }
        ]
    },
    {
        requesterId: donors[2]._id, // Fatima
        patientName: 'Jamal Uddin',
        contactNumber: '01833333333',
        bloodType: 'B+',
        unitsNeeded: 3,
        hospital: 'Square Hospital',
        location: 'Dhaka',
        urgency: 'Critical',
        status: 'Open',
        compatibleDonorsCount: 3,
        statusHistory: [
            { stage: 'Open', timestamp: daysAgo(1) }
        ]
    },
    {
        requesterId: donors[7]._id, // Tanvir
        patientName: 'Salma Khatun',
        contactNumber: '01844444444',
        bloodType: 'O+',
        unitsNeeded: 2,
        hospital: 'BIRDEM Hospital',
        location: 'Dhaka',
        urgency: 'Normal',
        status: 'Completed',
        matchedDonorId: donors[11]._id, // Sakib
        donorConsent: true,
        requesterConsent: true,
        compatibleDonorsCount: 5,
        statusHistory: [
            { stage: 'Open', timestamp: daysAgo(45) },
            { stage: 'Donors Notified', timestamp: daysAgo(44) },
            { stage: 'Donor Matched', timestamp: daysAgo(43) },
            { stage: 'Contact Shared', timestamp: daysAgo(43) },
            { stage: 'Scheduled', timestamp: daysAgo(42) },
            { stage: 'Completed', timestamp: daysAgo(40) }
        ]
    },
    {
        requesterId: donors[3]._id, // Karim
        patientName: 'Monir Chowdhury',
        contactNumber: '01855555555',
        bloodType: 'O-',
        unitsNeeded: 1,
        hospital: 'Chattogram Medical College',
        location: 'Chittagong',
        urgency: 'Critical',
        status: 'Donors Notified',
        compatibleDonorsCount: 1,
        statusHistory: [
            { stage: 'Open', timestamp: daysAgo(3) },
            { stage: 'Donors Notified', timestamp: daysAgo(2) }
        ]
    },
    {
        requesterId: donors[1]._id, // Rahim
        patientName: 'Nasrin Sultana',
        contactNumber: '01866666666',
        bloodType: 'A-',
        unitsNeeded: 2,
        hospital: 'United Hospital',
        location: 'Dhaka',
        urgency: 'Urgent',
        status: 'Completed',
        matchedDonorId: donors[5]._id, // Arif
        donorConsent: true,
        requesterConsent: true,
        compatibleDonorsCount: 2,
        statusHistory: [
            { stage: 'Open', timestamp: daysAgo(60) },
            { stage: 'Donors Notified', timestamp: daysAgo(59) },
            { stage: 'Donor Matched', timestamp: daysAgo(58) },
            { stage: 'Contact Shared', timestamp: daysAgo(58) },
            { stage: 'Scheduled', timestamp: daysAgo(57) },
            { stage: 'Completed', timestamp: daysAgo(55) }
        ]
    },
    {
        requesterId: donors[6]._id, // Sumaiya
        patientName: 'Hafiz Ahmed',
        contactNumber: '01877777777',
        bloodType: 'B-',
        unitsNeeded: 1,
        hospital: 'Rajshahi Medical College Hospital',
        location: 'Rajshahi',
        urgency: 'Normal',
        status: 'Contact Shared',
        matchedDonorId: donors[6]._id,
        donorConsent: true,
        requesterConsent: true,
        compatibleDonorsCount: 1,
        statusHistory: [
            { stage: 'Open', timestamp: daysAgo(10) },
            { stage: 'Donors Notified', timestamp: daysAgo(9) },
            { stage: 'Donor Matched', timestamp: daysAgo(8) },
            { stage: 'Contact Shared', timestamp: daysAgo(7) }
        ]
    },
    {
        requesterId: donors[10]._id, // Riya
        patientName: 'Priya Sen',
        contactNumber: '01888888888',
        bloodType: 'B+',
        unitsNeeded: 2,
        hospital: 'Evercare Hospital',
        location: 'Dhaka',
        urgency: 'Urgent',
        status: 'Scheduled',
        matchedDonorId: donors[2]._id, // Fatima
        donorConsent: true,
        requesterConsent: true,
        compatibleDonorsCount: 3,
        statusHistory: [
            { stage: 'Open', timestamp: daysAgo(7) },
            { stage: 'Donors Notified', timestamp: daysAgo(6) },
            { stage: 'Donor Matched', timestamp: daysAgo(5) },
            { stage: 'Contact Shared', timestamp: daysAgo(4) },
            { stage: 'Scheduled', timestamp: daysAgo(3) }
        ]
    }
];

const buildDonations = (donors, requests) => [
    {
        donorId: donors[9]._id,
        requestId: requests[0]._id,
        donationDate: daysAgo(27),
        bloodType: 'A+',
        location: 'Dhaka',
        recipientAnonymized: 'Patient #4821',
        status: 'Completed'
    },
    {
        donorId: donors[11]._id,
        requestId: requests[3]._id,
        donationDate: daysAgo(40),
        bloodType: 'O+',
        location: 'Dhaka',
        recipientAnonymized: 'Patient #3917',
        status: 'Completed'
    },
    {
        donorId: donors[5]._id,
        requestId: requests[5]._id,
        donationDate: daysAgo(55),
        bloodType: 'A-',
        location: 'Dhaka',
        recipientAnonymized: 'Patient #2653',
        status: 'Completed'
    },
    {
        donorId: donors[2]._id,
        requestId: requests[7]._id,
        donationDate: daysAgo(1),
        bloodType: 'B+',
        location: 'Dhaka',
        recipientAnonymized: 'Patient #5094',
        status: 'Scheduled'
    },
    {
        donorId: donors[7]._id,
        requestId: requests[0]._id,
        donationDate: daysAgo(90),
        bloodType: 'O+',
        location: 'Dhaka',
        recipientAnonymized: 'Patient #1287',
        status: 'Completed'
    },
    {
        donorId: donors[1]._id,
        requestId: requests[3]._id,
        donationDate: daysAgo(120),
        bloodType: 'A+',
        location: 'Chittagong',
        recipientAnonymized: 'Patient #7743',
        status: 'Completed'
    }
];

const buildNotifications = (donors, requests) => [
    { donorId: donors[1]._id, requestId: requests[0]._id, message: '🚨 Critical: A+ blood needed at Dhaka Medical College Hospital', bloodType: 'A+', hospital: 'Dhaka Medical College Hospital', urgency: 'Critical', isRead: true },
    { donorId: donors[9]._id, requestId: requests[0]._id, message: '🚨 Critical: A+ blood needed at Dhaka Medical College Hospital', bloodType: 'A+', hospital: 'Dhaka Medical College Hospital', urgency: 'Critical', isRead: true },
    { donorId: donors[4]._id, requestId: requests[1]._id, message: '⚠️ Urgent: AB+ blood needed at Sylhet MAG Osmani Medical College', bloodType: 'AB+', hospital: 'Sylhet MAG Osmani Medical College', urgency: 'Urgent', isRead: true },
    { donorId: donors[8]._id, requestId: requests[1]._id, message: '⚠️ Urgent: AB+ blood needed at Sylhet MAG Osmani Medical College', bloodType: 'AB+', hospital: 'Sylhet MAG Osmani Medical College', urgency: 'Urgent', isRead: false },
    { donorId: donors[2]._id, requestId: requests[2]._id, message: '🚨 Critical: B+ blood needed at Square Hospital', bloodType: 'B+', hospital: 'Square Hospital', urgency: 'Critical', isRead: false },
    { donorId: donors[10]._id, requestId: requests[2]._id, message: '🚨 Critical: B+ blood needed at Square Hospital', bloodType: 'B+', hospital: 'Square Hospital', urgency: 'Critical', isRead: false },
    { donorId: donors[7]._id, requestId: requests[3]._id, message: 'O+ blood needed at BIRDEM Hospital', bloodType: 'O+', hospital: 'BIRDEM Hospital', urgency: 'Normal', isRead: true },
    { donorId: donors[11]._id, requestId: requests[3]._id, message: 'O+ blood needed at BIRDEM Hospital', bloodType: 'O+', hospital: 'BIRDEM Hospital', urgency: 'Normal', isRead: true },
    { donorId: donors[0]._id, requestId: requests[3]._id, message: 'O+ blood needed at BIRDEM Hospital', bloodType: 'O+', hospital: 'BIRDEM Hospital', urgency: 'Normal', isRead: true },
    { donorId: donors[3]._id, requestId: requests[4]._id, message: '🚨 Critical: O- blood needed at Chattogram Medical College', bloodType: 'O-', hospital: 'Chattogram Medical College', urgency: 'Critical', isRead: false },
    { donorId: donors[5]._id, requestId: requests[5]._id, message: '⚠️ Urgent: A- blood needed at United Hospital', bloodType: 'A-', hospital: 'United Hospital', urgency: 'Urgent', isRead: true },
    { donorId: donors[1]._id, requestId: requests[2]._id, message: '🚨 Critical: B+ blood needed at Square Hospital — you are A+ compatible', bloodType: 'B+', hospital: 'Square Hospital', urgency: 'Critical', isRead: false },
    { donorId: donors[6]._id, requestId: requests[6]._id, message: 'B- blood needed at Rajshahi Medical College Hospital', bloodType: 'B-', hospital: 'Rajshahi Medical College Hospital', urgency: 'Normal', isRead: true },
    { donorId: donors[2]._id, requestId: requests[7]._id, message: '⚠️ Urgent: B+ blood needed at Evercare Hospital', bloodType: 'B+', hospital: 'Evercare Hospital', urgency: 'Urgent', isRead: true },
    { donorId: donors[7]._id, requestId: requests[2]._id, message: '🚨 Critical: B+ blood needed at Square Hospital — universal donor match', bloodType: 'B+', hospital: 'Square Hospital', urgency: 'Critical', isRead: false }
];

const buildFeedback = (donors, requests) => [
    { donorId: donors[9]._id, requestId: requests[0]._id, rating: 5, message: 'Rahim was very helpful and responded quickly. Thank you for saving a life!', allowPublic: true },
    { donorId: donors[11]._id, requestId: requests[3]._id, rating: 4, message: 'Great experience. The platform made it easy to connect.', allowPublic: true },
    { donorId: donors[5]._id, requestId: requests[5]._id, rating: 5, message: 'Arif responded within hours. Truly a lifesaver!', allowPublic: true },
    { donorId: donors[2]._id, requestId: requests[7]._id, rating: 4, message: 'Smooth process. Would recommend this platform.', allowPublic: false }
];

const buildFAQs = () => [
    { question: 'Who can donate blood?', answer: 'Generally, anyone aged 18-65 who weighs at least 50 kg and is in good health can donate blood. You must not have donated in the last 56 days.', category: 'Eligibility', order: 1, isActive: true },
    { question: 'How often can I donate blood?', answer: 'You can donate whole blood every 56 days (8 weeks). Our platform automatically tracks your eligibility based on your last donation date.', category: 'Eligibility', order: 2, isActive: true },
    { question: 'What blood types are compatible?', answer: 'Blood compatibility depends on ABO and Rh factors. O- is the universal donor. AB+ is the universal recipient. Check our Blood Compatibility Chart for the full mapping.', category: 'Blood Types', order: 1, isActive: true },
    { question: 'How should I prepare before donating?', answer: 'Drink plenty of water, eat a healthy meal, avoid fatty foods, get a good night\'s sleep, and wear comfortable clothing with sleeves that can be raised above the elbow.', category: 'Preparation', order: 1, isActive: true },
    { question: 'What happens after I donate blood?', answer: 'Rest for 10-15 minutes, drink extra fluids for the next 24 hours, avoid heavy lifting for 5 hours, and eat iron-rich foods. You\'ll receive a donation record on the platform.', category: 'After Donation', order: 1, isActive: true },
    { question: 'Is blood donation safe?', answer: 'Yes, blood donation is very safe. A sterile, single-use needle is used for each donor. You cannot get any disease from donating blood. The process takes about 10-15 minutes.', category: 'Preparation', order: 2, isActive: true }
];

const buildAlertLogs = (admin) => [
    { bloodType: 'O-', city: 'Dhaka', message: 'Urgent need for O- blood at Dhaka Medical College. Multiple patients in critical condition.', donorsNotified: 3, sentBy: admin._id },
    { bloodType: 'A+', city: 'Chittagong', message: 'Emergency A+ blood required at Chattogram Medical College Hospital for accident victims.', donorsNotified: 5, sentBy: admin._id },
    { bloodType: 'B+', city: 'Dhaka', message: 'B+ blood shortage at Square Hospital. Please donate if you are eligible.', donorsNotified: 8, sentBy: admin._id }
];

// ==================== SEED FUNCTION ====================

const seedDatabase = async () => {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear flag
        if (process.argv.includes('--clear')) {
            console.log('🗑️  Clearing all existing data...');
            await Promise.all([
                Donor.deleteMany({}),
                BloodRequest.deleteMany({}),
                Donation.deleteMany({}),
                Notification.deleteMany({}),
                Feedback.deleteMany({}),
                FAQ.deleteMany({}),
                AlertLog.deleteMany({})
            ]);
            console.log('✅ All collections cleared');
        }

        // 1. Seed Donors
        console.log('\n👤 Seeding donors...');
        const donorData = await buildDonors();
        const donors = await Donor.insertMany(donorData);
        console.log(`   ✅ ${donors.length} donors created`);
        console.log(`   🔑 Admin: admin@bloodconnect.com / admin123`);
        console.log(`   🔑 Donor: rahim.khan@gmail.com / donor123`);

        // 2. Seed Blood Requests (skip pre-save hook for statusHistory)
        console.log('\n🩸 Seeding blood requests...');
        const requestData = buildRequests(donors);
        const requests = await BloodRequest.insertMany(requestData);
        console.log(`   ✅ ${requests.length} blood requests created`);

        // 3. Seed Donations
        console.log('\n💉 Seeding donations...');
        const donationData = buildDonations(donors, requests);
        const donations = await Donation.insertMany(donationData);
        console.log(`   ✅ ${donations.length} donations created`);

        // 4. Seed Notifications
        console.log('\n🔔 Seeding notifications...');
        const notifData = buildNotifications(donors, requests);
        const notifications = await Notification.insertMany(notifData);
        console.log(`   ✅ ${notifications.length} notifications created`);

        // 5. Seed Feedback
        console.log('\n⭐ Seeding feedback...');
        const feedbackData = buildFeedback(donors, requests);
        const feedback = await Feedback.insertMany(feedbackData);
        console.log(`   ✅ ${feedback.length} feedback entries created`);

        // 6. Seed FAQs
        console.log('\n❓ Seeding FAQs...');
        const faqData = buildFAQs();
        const faqs = await FAQ.insertMany(faqData);
        console.log(`   ✅ ${faqs.length} FAQs created`);

        // 7. Seed Alert Logs
        console.log('\n📢 Seeding broadcast history...');
        const alertData = buildAlertLogs(donors[0]); // admin
        const alerts = await AlertLog.insertMany(alertData);
        console.log(`   ✅ ${alerts.length} broadcast logs created`);

        // Summary
        console.log('\n' + '='.repeat(50));
        console.log('🎉 DATABASE SEEDED SUCCESSFULLY!');
        console.log('='.repeat(50));
        console.log(`   Donors:         ${donors.length}`);
        console.log(`   Requests:       ${requests.length}`);
        console.log(`   Donations:      ${donations.length}`);
        console.log(`   Notifications:  ${notifications.length}`);
        console.log(`   Feedback:       ${feedback.length}`);
        console.log(`   FAQs:           ${faqs.length}`);
        console.log(`   Broadcasts:     ${alerts.length}`);
        console.log('='.repeat(50));

    } catch (error) {
        console.error('❌ Seed error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 MongoDB connection closed');
        process.exit(0);
    }
};

seedDatabase();
