const rateLimit = require("express-rate-limit");

// Tight limiter for credential endpoints — blocks brute-force attacks.
// 10 attempts per IP per 10 minutes.
const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again after 10 minutes." },
});

module.exports = { authLimiter };
