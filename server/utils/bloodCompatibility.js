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
 * Find eligible donors matching blood compatibility, city, and availability.
 * Verified donors are sorted first.
 * @param {string} bloodType - Required blood type
 * @param {string} city - City to search in
 * @returns {Promise<Array>} Array of eligible donors
 */
const findEligibleDonors = async (bloodType, city) => {
    const compatibleTypes = getCompatibleDonorTypes(bloodType);
    const today = new Date();

    return await Donor.find({
        bloodType: { $in: compatibleTypes },
        city: city,
        isAvailable: true,
        isSuspended: false,
        $or: [
            { nextEligibleDate: { $lte: today } },
            { nextEligibleDate: null }
        ]
    }).sort({ isVerified: -1 }) // verified donors appear first
        .select('-password');
};

module.exports = { compatibilityMap, getCompatibleDonorTypes, findEligibleDonors };
