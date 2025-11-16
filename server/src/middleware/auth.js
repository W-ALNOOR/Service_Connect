const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verifies token using RSA public key (RS256) if provided, otherwise uses HS256 secret.
async function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const [, token] = auth.split(" "); 
    if (!token) return res.status(401).json({ message: "No token provided" });

    let decoded;
    if (process.env.JWT_PUBLIC_KEY) {
     
      const publicKey = process.env.JWT_PUBLIC_KEY.replace(/\\n/g, "\n");
      decoded = jwt.verify(token, publicKey, { algorithms: ["RS256"] });
    } else {
      decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
    }

    req.user = decoded; 
    req.userDoc = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole }; 
