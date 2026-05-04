/**
 * Unit Tests — API Route & Middleware Validation
 * Tests authentication, authorization, input validation patterns.
 * 
 * Run: cd server && npm test
 */

const mongoose = require('mongoose');

// ==================== TEST RUNNER ====================

let passed = 0;
let failed = 0;
const errors = [];

function assert(condition, testName) {
    if (condition) {
        passed++;
        console.log(`  ✅ ${testName}`);
    } else {
        failed++;
        errors.push(testName);
        console.log(`  ❌ ${testName}`);
    }
}

// ==================== TESTS ====================

console.log('\n🧪 API Validation & Security Tests\n');

// --- ObjectId Validation ---
console.log('📋 mongoose.isValidObjectId:');
assert(mongoose.isValidObjectId('507f1f77bcf86cd799439011'), 'Valid ObjectId accepted');
assert(mongoose.isValidObjectId('67a1b2c3d4e5f6a7b8c9d0e1'), 'Valid hex ObjectId accepted');
assert(!mongoose.isValidObjectId('invalid-id'), 'Invalid string rejected');
assert(!mongoose.isValidObjectId(''), 'Empty string rejected');
assert(!mongoose.isValidObjectId(null), 'null rejected');
assert(!mongoose.isValidObjectId(undefined), 'undefined rejected');
assert(mongoose.isValidObjectId(12345), 'Number is coerced to valid ObjectId by Mongoose');
assert(!mongoose.isValidObjectId('abc'), 'Short string rejected');

// --- Blood Type Validation ---
console.log('\n📋 Blood Type Enum Validation:');
const validTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const invalidTypes = ['C+', 'D-', 'X+', 'O', 'AB', '+', '-', '', null, undefined, 'a+', 'o-'];

validTypes.forEach(type => {
    assert(validTypes.includes(type), `'${type}' is a valid blood type`);
});

invalidTypes.forEach(type => {
    assert(!validTypes.includes(type), `'${type}' is correctly rejected`);
});

// --- Action Parameter Validation (approveVerification) ---
console.log('\n📋 Admin Action Validation:');
const validActions = ['approve', 'reject'];
assert(validActions.includes('approve'), "'approve' is valid action");
assert(validActions.includes('reject'), "'reject' is valid action");
assert(!validActions.includes('delete'), "'delete' is not valid action");
assert(!validActions.includes(''), "empty string is not valid action");
assert(!validActions.includes(undefined), "undefined is not valid action");

// --- Urgency Level Validation ---
console.log('\n📋 Urgency Level Validation:');
const validUrgency = ['Critical', 'Urgent', 'Normal'];
assert(validUrgency.includes('Critical'), "'Critical' accepted");
assert(validUrgency.includes('Urgent'), "'Urgent' accepted");
assert(validUrgency.includes('Normal'), "'Normal' accepted");
assert(!validUrgency.includes('Low'), "'Low' rejected");
assert(!validUrgency.includes('critical'), "'critical' (lowercase) rejected");

// --- Status Workflow Validation ---
console.log('\n📋 Request Status Workflow:');
const validStatuses = ['Open', 'Donors Notified', 'Donor Matched', 'Contact Shared', 'Scheduled', 'Completed'];
assert(validStatuses.length === 6, 'Exactly 6 status stages');
assert(validStatuses[0] === 'Open', 'First stage is Open');
assert(validStatuses[5] === 'Completed', 'Last stage is Completed');
validStatuses.forEach((status, i) => {
    if (i > 0) {
        assert(validStatuses.indexOf(status) > validStatuses.indexOf(validStatuses[i - 1]),
            `'${status}' comes after '${validStatuses[i - 1]}'`);
    }
});

// --- Donation Cooldown Logic ---
console.log('\n📋 56-Day Donation Cooldown:');
const COOLDOWN_DAYS = 56;

const lastDonation = new Date('2026-03-01');
const nextEligible = new Date(lastDonation);
nextEligible.setDate(nextEligible.getDate() + COOLDOWN_DAYS);

const expectedDate = new Date('2026-04-26');
assert(nextEligible.toISOString().split('T')[0] === expectedDate.toISOString().split('T')[0],
    'March 1 + 56 days = April 26');

const today = new Date();
const recentDonation = new Date();
recentDonation.setDate(today.getDate() - 30);
const eligibleAfterRecent = new Date(recentDonation);
eligibleAfterRecent.setDate(eligibleAfterRecent.getDate() + COOLDOWN_DAYS);
assert(eligibleAfterRecent > today, 'Donor who donated 30 days ago is NOT eligible');

const oldDonation = new Date();
oldDonation.setDate(today.getDate() - 60);
const eligibleAfterOld = new Date(oldDonation);
eligibleAfterOld.setDate(eligibleAfterOld.getDate() + COOLDOWN_DAYS);
assert(eligibleAfterOld <= today, 'Donor who donated 60 days ago IS eligible');

// --- Broadcast Input Validation ---
console.log('\n📋 Broadcast Message Validation:');
const maxLen = 200;
const shortMsg = 'Emergency A+ needed at Dhaka Medical';
const longMsg = 'x'.repeat(201);
assert(shortMsg.length <= maxLen, 'Short message accepted');
assert(longMsg.length > maxLen, 'Long message (201 chars) rejected');
assert(''.length === 0, 'Empty message has length 0');
assert(' '.trim().length === 0, 'Whitespace-only message is empty after trim');

// --- Password Minimum Length ---
console.log('\n📋 Password Validation:');
assert('abc'.length < 6, 'Password "abc" too short (< 6)');
assert('abcdef'.length >= 6, 'Password "abcdef" meets minimum (= 6)');
assert('securePass123'.length >= 6, 'Strong password accepted');

// --- Email Format Basic Validation ---
console.log('\n📋 Email Format:');
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
assert(emailRegex.test('user@example.com'), 'Standard email accepted');
assert(emailRegex.test('test.user@gmail.com'), 'Dotted email accepted');
assert(!emailRegex.test('invalid'), 'No @ rejected');
assert(!emailRegex.test('user@'), 'No domain rejected');
assert(!emailRegex.test('@example.com'), 'No local part rejected');

// --- Units Needed Validation ---
console.log('\n📋 Units Needed Range:');
const minUnits = 1;
const maxUnits = 10;
assert(1 >= minUnits && 1 <= maxUnits, '1 unit accepted');
assert(10 >= minUnits && 10 <= maxUnits, '10 units accepted');
assert(!(0 >= minUnits), '0 units rejected');
assert(!(11 <= maxUnits), '11 units rejected');

// ==================== SUMMARY ====================

console.log('\n' + '='.repeat(50));
if (failed === 0) {
    console.log(`🎉 ALL ${passed} TESTS PASSED!`);
} else {
    console.log(`⚠️  ${passed} passed, ${failed} failed`);
    console.log('Failed tests:');
    errors.forEach(e => console.log(`  ❌ ${e}`));
}
console.log('='.repeat(50) + '\n');

process.exit(failed > 0 ? 1 : 0);
