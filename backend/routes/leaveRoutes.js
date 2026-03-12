const express = require('express');
const router = express.Router();
const { 
  createLeaveRequest, 
  getAllLeaveRequests, 
  updateLeaveStatus,
  getMyLeaves,      
  updateMyLeave,
  deleteMyLeave     
} = require('../controllers/leaveController');
const { protect, admin } = require('../middleware/authMiddleware');
const { createLeaveValidation, updateLeaveStatusValidation } = require('../middleware/validators');

// --- ÜYE ROTALARI ---
router.post('/', protect, createLeaveValidation, createLeaveRequest); 

// ÖNEMLİ: /my-leaves rotası, parametreli (/:id) rotalardan her zaman ÜSTTE olmalı!
router.get('/my-leaves', protect, getMyLeaves); 

router.put('/:id', protect, updateMyLeave);      
router.delete('/:id', protect, deleteMyLeave);   

// --- ADMİN ROTALARI ---
router.get('/', protect, admin, getAllLeaveRequests); 
router.put('/:id/status', protect, admin, updateLeaveStatusValidation, updateLeaveStatus); 

module.exports = router;