const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, listAll, updateDepartment } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');
const { updateProfileValidation } = require('../middleware/validators');

router.get('/list', protect, admin, listAll);
router.get('/me', protect, getProfile);
router.get('/profile', protect, getProfile); // ProtectedRoute bileşeni bu endpoint'i kullanır
router.put('/me', protect, updateProfileValidation, updateProfile);
router.put('/:id/department', protect, admin, updateDepartment);

module.exports = router;
