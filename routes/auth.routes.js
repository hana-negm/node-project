const express = require("express");
const rateLimit = require("express-rate-limit");
const authController = require("../controllers/auth.controller");
const validate = require("../middlewares/validate.middleware");
const { registerSchema, loginSchema } = require("../validations/auth.validation");

const router = express.Router();


const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  
  message: { status: "error", message: "Too many login attempts, please try again later." }
});

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", loginLimiter, validate(loginSchema), authController.login);

module.exports = router;