/**
 * Unit Tests — Blood Compatibility Utility
 * Tests the hand-written ABO-Rh matching algorithm.
 * 
 * Run: cd server && npm test
 */

const { 
    compatibilityMap, 
    getCompatibleDonorTypes, 
    getCompatibilityScore, 
    getMatchDetails 
} = require('../utils/bloodCompatibility');

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

function assertEqual(actual, expected, testName) {
    const match = JSON.stringify(actual) === JSON.stringify(expected);
    if (!match) {
        console.log(`     Expected: ${JSON.stringify(expected)}`);
        console.log(`     Actual:   ${JSON.stringify(actual)}`);
    }
    assert(match, testName);
}

// ==================== TESTS ====================

console.log('\n🧪 Blood Compatibility Utility Tests\n');

// --- compatibilityMap ---
console.log('📋 compatibilityMap:');
assert(compatibilityMap['O-'].length === 1, 'O- can only receive from O-');
assert(compatibilityMap['AB+'].length === 8, 'AB+ is universal recipient (8 types)');
assert(compatibilityMap['O+'].includes('O-'), 'O+ can receive from O-');
assert(!compatibilityMap['A+'].includes('B+'), 'A+ cannot receive from B+');

// --- getCompatibleDonorTypes ---
console.log('\n📋 getCompatibleDonorTypes:');
assertEqual(getCompatibleDonorTypes('O-'), ['O-'], 'O- only gets O-');
assertEqual(getCompatibleDonorTypes('A+').sort(), ['A+', 'A-', 'O+', 'O-'].sort(), 'A+ compatible types');
assertEqual(getCompatibleDonorTypes('B-').sort(), ['B-', 'O-'].sort(), 'B- compatible types');
assertEqual(getCompatibleDonorTypes('INVALID'), [], 'Invalid type returns empty');

// --- getCompatibilityScore ---
console.log('\n📋 getCompatibilityScore:');
assertEqual(getCompatibilityScore('A+', 'A+'), 3, 'Exact match = 3');
assertEqual(getCompatibilityScore('A-', 'A+'), 2, 'Same group, different Rh = 2');
assertEqual(getCompatibilityScore('O-', 'A+'), 1, 'Cross-group compatible = 1');
assertEqual(getCompatibilityScore('O+', 'A+'), 1, 'O+ to A+ = cross-group = 1');
assertEqual(getCompatibilityScore('B+', 'A+'), 0, 'Incompatible = 0');
assertEqual(getCompatibilityScore('AB+', 'O-'), 0, 'AB+ cannot donate to O-');
assertEqual(getCompatibilityScore('O-', 'O-'), 3, 'O- to O- = exact');
assertEqual(getCompatibilityScore('O-', 'AB+'), 1, 'O- to AB+ = cross-group');

// --- getMatchDetails ---
console.log('\n📋 getMatchDetails:');
const exactMatch = getMatchDetails('B+', 'B+');
assertEqual(exactMatch.score, 3, 'getMatchDetails exact score');
assertEqual(exactMatch.label, 'Exact Match', 'getMatchDetails exact label');
assert(exactMatch.description.includes('exact match'), 'getMatchDetails exact description');

const rhMatch = getMatchDetails('B-', 'B+');
assertEqual(rhMatch.score, 2, 'getMatchDetails Rh score');
assertEqual(rhMatch.label, 'Rh-Compatible', 'getMatchDetails Rh label');

const crossMatch = getMatchDetails('O-', 'B+');
assertEqual(crossMatch.score, 1, 'getMatchDetails cross score');
assertEqual(crossMatch.label, 'Cross-Compatible', 'getMatchDetails cross label');

const noMatch = getMatchDetails('A+', 'B-');
assertEqual(noMatch.score, 0, 'getMatchDetails no match score');
assertEqual(noMatch.label, 'Not Compatible', 'getMatchDetails no match label');

// --- Edge Cases ---
console.log('\n📋 Edge Cases:');
assertEqual(getCompatibilityScore(undefined, 'A+'), 0, 'undefined donor type = 0');
assertEqual(getCompatibleDonorTypes(null), [], 'null blood type = empty');

// All 8 types can donate to AB+ (universal recipient)
const allTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const abPlusCompatible = getCompatibleDonorTypes('AB+');
allTypes.forEach(type => {
    assert(abPlusCompatible.includes(type), `AB+ can receive from ${type}`);
});

// O- can donate to all 8 types
allTypes.forEach(type => {
    const compatible = getCompatibleDonorTypes(type);
    assert(compatible.includes('O-'), `O- can donate to ${type}`);
});

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
