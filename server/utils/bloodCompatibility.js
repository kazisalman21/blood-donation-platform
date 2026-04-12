const Donor = require('../models/Donor');

/**
 * Blood Compatibility Map
 * Maps each blood type to the array of blood types that can DONATE to it.
 * This is hand-written — no external library (course requirement).
 */
const compatibilityMap = {
    'A+': ['A+', 'A-', 'O+', 'O-'],
    'A-': ['A-', 'O-'],
    'B+': ['B+', 'B-', 'O+', 'O-'],
    'B-': ['B-', 'O-'],
    'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],  // Universal recipient
    'AB-': ['AB-', 'A-', 'B-', 'O-'],
    'O+': ['O+', 'O-'],
    'O-': ['O-']   // Universal donor — can only receive O-
};

/**
 * Get compatible donor blood types for a given recipient blood type.
 * @param {string} neededBloodType - The blood type needed
 * @returns {string[]} Array of compatible donor blood types
 */
const getCompatibleDonorTypes = (neededBloodType) => {
    return compatibilityMap[neededBloodType] || [];
};

/**
 * Calculate a compatibility score between a donor blood type and needed blood type.
 * Higher score = better match priority.
 * Hand-written scoring algorithm — no external library.
 *
 * @param {string} donorBloodType - The donor's blood type
 * @param {string} neededBloodType - The blood type needed by the patient
 * @returns {number} Score: 3 = exact match, 2 = same-group Rh-compatible, 1 = cross-group compatible
 */
const getCompatibilityScore = (donorBloodType, neededBloodType) => {
    // Not compatible at all
    const compatibleTypes = compatibilityMap[neededBloodType] || [];
    if (!compatibleTypes.includes(donorBloodType)) {
        return 0;
    }

    // Exact blood type match — best possible
    if (donorBloodType === neededBloodType) {
        return 3;
    }

    // Same ABO group but different Rh factor (e.g., A- donating to A+)
    const donorGroup = donorBloodType.replace(/[+-]/, '');
    const neededGroup = neededBloodType.replace(/[+-]/, '');
    if (donorGroup === neededGroup) {
        return 2;
    }

    // Cross-group compatible (e.g., O- donating to A+)
    return 1;
};

/**
 * Get a human-readable description of why a donor is compatible.
 * Hand-written — no external library.
 *
 * @param {string} donorBloodType - The donor's blood type
 * @param {string} neededBloodType - The blood type needed
 * @returns {object} { score, label, description }
 */
const getMatchDetails = (donorBloodType, neededBloodType) => {
    const score = getCompatibilityScore(donorBloodType, neededBloodType);

    const labels = {
        3: 'Exact Match',
        2: 'Rh-Compatible',
        1: 'Cross-Compatible',
        0: 'Not Compatible'
    };

    const descriptions = {
        3: `${donorBloodType} is an exact match for ${neededBloodType}`,
        2: `${donorBloodType} is Rh-compatible with ${neededBloodType} (same ABO group)`,
        1: `${donorBloodType} can donate to ${neededBloodType} (cross-group compatibility)`,
        0: `${donorBloodType} cannot donate to ${neededBloodType}`
    };

    return {
        score,
        label: labels[score],
        description: descriptions[score],
        donorBloodType,
        neededBloodType
    };
};

/**
 * Find eligible donors matching blood compatibility, city, and availability.
 * Results are sorted by compatibility score (exact matches first), then verified status.
 * Hand-written matching algorithm — no external library.
 *
 * @param {string} bloodType - Required blood type
 * @param {string} city - City to search in
 * @returns {Promise<Array>} Array of eligible donors with compatibility details
 */
const findEligibleDonors = async (bloodType, city) => {
    const compatibleTypes = getCompatibleDonorTypes(bloodType);
    const today = new Date();

    const donors = await Donor.find({
        bloodType: { $in: compatibleTypes },
        city: city,
        isAvailable: true,
        isSuspended: false,
        $or: [
            { nextEligibleDate: { $lte: today } },
            { nextEligibleDate: null }
        ]
    }).select('-password');

    // Add compatibility score to each donor and sort by score (desc), then verified status
    const donorsWithScores = donors.map(donor => {
        const matchDetails = getMatchDetails(donor.bloodType, bloodType);
        return {
            ...donor.toObject(),
            compatibilityScore: matchDetails.score,
            compatibilityLabel: matchDetails.label,
            compatibilityDescription: matchDetails.description
        };
    });

    // Sort: highest score first, then verified donors first within same score
    donorsWithScores.sort((a, b) => {
        if (b.compatibilityScore !== a.compatibilityScore) {
            return b.compatibilityScore - a.compatibilityScore;
        }
        // Within same score, verified donors come first
        return (b.isVerified ? 1 : 0) - (a.isVerified ? 1 : 0);
    });

    return donorsWithScores;
};

module.exports = { compatibilityMap, getCompatibleDonorTypes, getCompatibilityScore, getMatchDetails, findEligibleDonors };
