const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      return next(); // ← add 'return' here to stop execution after this
    } catch (error) {
      res.status(401);
      return next(new Error('Not authorized, token failed')); // ← add 'return'
    }
  }

  // This only runs if there was no Authorization header at all
  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, no token'));
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403);
      return next(
        new Error(`Role '${req.user.role}' is not authorized to access this route`)
      );
    }
    next();
  };
};

module.exports = { protect, authorize };