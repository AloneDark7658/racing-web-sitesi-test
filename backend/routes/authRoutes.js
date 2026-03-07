const express = require('express');
const router = express.Router();

// 1. Controller dosyasındaki tüm fonksiyonları içeri alıyoruz
const { register, login, forgotPassword, resetPassword } = require('../controllers/authController');

// --- MEVCUT ROTALAR ---
router.post('/register', register);
router.post('/login', login);

// --- YENİ EKLENEN ŞİFRE SIFIRLAMA ROTALARI ---
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:token', resetPassword);

module.exports = router;