const rateLimit = require('express-rate-limit');

// Genel API limiti: Dakikada 100 istek
const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 dakika
  max: 100,
  message: { message: 'Çok fazla istek gönderdiniz. Lütfen biraz bekleyin.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Login/Register limiti: Dakikada 5 deneme
const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 dakika
  max: 5,
  message: { message: 'Çok fazla giriş denemesi. 1 dakika sonra tekrar deneyin.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Şifre sıfırlama limiti: Dakikada 3 istek
const passwordResetLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 dakika
  max: 3,
  message: { message: 'Çok fazla şifre sıfırlama denemesi. 1 dakika sonra tekrar deneyin.' },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = { generalLimiter, authLimiter, passwordResetLimiter };
