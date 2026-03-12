const { body, param, validationResult } = require('express-validator');

// Hataları kontrol et ve varsa 400 döndür
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: errors.array()[0].msg,
      errors: errors.array() 
    });
  }
  next();
};

// --- AUTH VALIDATION ---
const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Ad Soyad zorunludur.')
    .isLength({ min: 2, max: 100 }).withMessage('İsim 2-100 karakter arası olmalıdır.')
    .escape(), // XSS koruması
  body('email')
    .trim()
    .notEmpty().withMessage('E-posta zorunludur.')
    .isEmail().withMessage('Geçerli bir e-posta adresi girin.')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Şifre zorunludur.')
    .isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalıdır.'),
  body('studentId')
    .trim()
    .notEmpty().withMessage('Öğrenci numarası zorunludur.')
    .escape(),
  handleValidationErrors
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('E-posta zorunludur.')
    .isEmail().withMessage('Geçerli bir e-posta adresi girin.')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Şifre zorunludur.'),
  handleValidationErrors
];

const forgotPasswordValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('E-posta zorunludur.')
    .isEmail().withMessage('Geçerli bir e-posta adresi girin.')
    .normalizeEmail(),
  handleValidationErrors
];

const resetPasswordValidation = [
  body('password')
    .notEmpty().withMessage('Yeni şifre zorunludur.')
    .isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalıdır.'),
  handleValidationErrors
];

// --- LEAVE VALIDATION ---
const createLeaveValidation = [
  body('requestedDate')
    .notEmpty().withMessage('Tarih zorunludur.')
    .isISO8601().withMessage('Geçerli bir tarih formatı girin.'),
  body('reason')
    .trim()
    .notEmpty().withMessage('Mazeret zorunludur.')
    .isLength({ min: 3, max: 500 }).withMessage('Mazeret 3-500 karakter arası olmalıdır.')
    .escape(),
  handleValidationErrors
];

const updateLeaveStatusValidation = [
  body('status')
    .notEmpty().withMessage('Durum zorunludur.')
    .isIn(['Onaylandı', 'Reddedildi', 'Bekliyor']).withMessage('Geçersiz durum.'),
  handleValidationErrors
];

// --- DEPARTMENT VALIDATION ---
const createDepartmentValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Departman adı zorunludur.')
    .isLength({ min: 2, max: 100 }).withMessage('Ad 2-100 karakter arası olmalıdır.')
    .escape(),
  handleValidationErrors
];

// --- ATTENDANCE VALIDATION ---
const scanValidation = [
  body('qrToken')
    .notEmpty().withMessage('QR token zorunludur.'),
  handleValidationErrors
];

// --- PROFILE VALIDATION ---
const updateProfileValidation = [
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Geçerli bir e-posta adresi girin.')
    .normalizeEmail(),
  body('newPassword')
    .optional()
    .isLength({ min: 6 }).withMessage('Yeni şifre en az 6 karakter olmalıdır.'),
  handleValidationErrors
];

module.exports = {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  createLeaveValidation,
  updateLeaveStatusValidation,
  createDepartmentValidation,
  scanValidation,
  updateProfileValidation
};
