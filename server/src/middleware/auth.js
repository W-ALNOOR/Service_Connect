const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verifies token using RSA public key (RS256) if provided, otherwise uses HS256 secret.
async function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || '';
    // Expecting format "Bearer <token>"
    const [, token] = auth.split(' ');
    if (!token) return res.status(401).json({ message: 'No token provided' });

    let decoded;
    // verifying with RSA public key if it exists
    if (process.env.JWT_PUBLIC_RS256) {
      const publicKey = process.env.JWT_PUBLIC_RS256.replace(/\\n/g, '\n');
      decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    } else {
      //fallback to HS256
      decoded = jwt.verify(token, process.env.JWT_SECRET_HS256, {
        algorithms: ['HS256'],
      });
    }
    //attach jwt payload containing user info to request object
    req.user = decoded;
    //used to fetch fresh user data from database subtract the password, so not including password.
    //purpose is to get the up to date user info in case it has last been changed.
    req.userDoc = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

//function to check if user has the required role privileges to proceed with the request/route. Could be a singular role or multiple roles, hence the spread operator.
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole }; 
