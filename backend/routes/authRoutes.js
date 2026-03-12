const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, resetPassword } = require('../controllers/authController');
const { authLimiter, passwordResetLimiter } = require('../middleware/rateLimiter');
const { 
  registerValidation, 
  loginValidation, 
  forgotPasswordValidation, 
  resetPasswordValidation 
} = require('../middleware/validators');

// --- AUTH ROTALARI (Rate Limited + Validated) ---
router.post('/register', authLimiter, registerValidation, register);
router.post('/login', authLimiter, loginValidation, login);
router.post('/forgotpassword', passwordResetLimiter, forgotPasswordValidation, forgotPassword);
router.put('/resetpassword/:token', passwordResetLimiter, resetPasswordValidation, resetPassword);

module.exports = router;