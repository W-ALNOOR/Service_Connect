const User = require("../models/User");
const jwt = require("jsonwebtoken");

// helper to create JWT
function generateToken(user) {
  const payload = { id: user._id, role: user.role };

  // Prefer RSA (RS256) if keys are provided (more secure for production)
  if (process.env.JWT_PRIVATE_KEY) {
    const privateKey = process.env.JWT_PRIVATE_KEY.replace(/\\n/g, "\n");
    return jwt.sign(payload, privateKey, { algorithm: "RS256", expiresIn: "7d" });
  }

  // Fallback to HMAC (HS256)
  return jwt.sign(payload, process.env.JWT_SECRET, { algorithm: "HS256", expiresIn: "7d" });
}

// register
async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing required fields" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already in use" });

    const user = await User.create({ name, email, password, role });
    const token = generateToken(user);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// login
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { register, login };
