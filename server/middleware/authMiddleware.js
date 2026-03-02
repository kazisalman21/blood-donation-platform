const jwt = require('jsonwebtoken');
const Donor = require('../models/Donor');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user to request (exclude password)
            req.user = await Donor.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }

            if (req.user.isSuspended) {
                return res.status(403).json({ message: 'Account is suspended' });
            }

            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token invalid' });
        }
    } else {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

module.exports = { protect };
