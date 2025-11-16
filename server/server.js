require("dotenv").config();
const app = require("./src/app");
const { connectDB } = require("./src/config/db");

const PORT = process.env.PORT || 4000;

const isProd = process.env.NODE_ENV === "production";


const FALLBACK_MONGO = "mongodb://127.0.0.1:27017/service_connect_db";
const mongoUri = process.env.MONGO_URI || FALLBACK_MONGO;

if (!process.env.MONGO_URI) {
  console.warn("⚠️  MONGO_URI is missing. Using local fallback:", mongoUri);
}

const hasHsSecret = !!process.env.JWT_SECRET;
const hasRsKeys = !!process.env.JWT_PRIVATE_KEY && !!process.env.JWT_PUBLIC_KEY;

if (isProd) {
  
  if (!hasRsKeys && !hasHsSecret) {
    console.error("❌ Production requires JWT_PRIVATE_KEY+JWT_PUBLIC_KEY or a JWT_SECRET environment variable.");
    process.exit(1);
  }
  if (hasHsSecret && process.env.JWT_SECRET.length < 32) {
    console.error("❌ JWT_SECRET is too short for production. Use a secret >= 32 characters or provide RSA keys.");
    process.exit(1);
  }
} else {
 
  if (!hasRsKeys && !hasHsSecret) {
    process.env.JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me_please_!_32_chars_len";
    console.warn("⚠️  JWT_SECRET not set. Using temporary development secret. Do NOT use this in production.");
  }
}

(async () => {
  try {
    await connectDB(mongoUri);
    app.listen(PORT, () => {
      console.log(`🚀 API listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
})();
