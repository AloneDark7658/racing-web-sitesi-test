const express = require('express');
const router = express.Router();

// Controller'dan fonksiyonları alırken isimlerin birebir aynı olduğundan emin olalım
const { 
  createLeaveRequest, 
  getAllLeaveRequests, 
  updateLeaveStatus,
  getMyLeaves,      
  updateMyLeave,
  deleteMyLeave     
} = require('../controllers/leaveController');

const { protect, admin } = require('../middleware/authMiddleware');

// --- ÜYE ROTALARI ---
router.post('/', protect, createLeaveRequest); 

// ÖNEMLİ: /my-leaves rotası, parametreli (/:id) rotalardan her zaman ÜSTTE olmalı!
router.get('/my-leaves', protect, getMyLeaves); 

router.put('/:id', protect, updateMyLeave);      
router.delete('/:id', protect, deleteMyLeave);   

// --- ADMİN ROTALARI ---
router.get('/', protect, admin, getAllLeaveRequests); 
router.put('/:id/status', protect, admin, updateLeaveStatus); 

module.exports = router;