const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const authService = require("../services/auth.service");

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  await authService.createUser(name, email, hashed, role);

  res.json({ message: "User registered" });
};

exports.login = async (req, res) => {
  const { email, password, captchaToken } = req.body;

  // ✅ 1. Check captcha token exists
  if (!captchaToken) {
    return res.status(400).json({ message: "Captcha required" });
  }

  try {
    // ✅ 2. Verify captcha with Google
    const captchaVerify = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: captchaToken,
        },
      }
    );

    if (!captchaVerify.data.success) {
      return res.status(400).json({ message: "Captcha verification failed" });
    }

    // ✅ 3. Your existing login logic (unchanged)
    const user = await authService.findUserByEmail(email);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET
    );

    return res.json({ token, user });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Captcha error" });
  }
};