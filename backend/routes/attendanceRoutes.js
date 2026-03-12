const express = require('express');
const router = express.Router();

const { 
  generateQR, 
  scanQR, 
  getActiveSession,
  getTodayAttendance,
  getAttendanceSummary,
  getUserAttendanceGraph,
  getMySummary,
  getMyGraph,
  updateSession,
  deleteSession
} = require('../controllers/attendanceController');

const { protect, admin } = require('../middleware/authMiddleware');
const { scanValidation } = require('../middleware/validators');

router.get('/active-session', protect, admin, getActiveSession);
router.get('/today', protect, admin, getTodayAttendance);
router.post('/generate', protect, admin, generateQR);
router.put('/session', protect, admin, updateSession);
router.delete('/session', protect, admin, deleteSession);
router.post('/scan', protect, scanValidation, scanQR);
router.get('/summary', protect, admin, getAttendanceSummary);
router.get('/graph/:userId', protect, admin, getUserAttendanceGraph);
router.get('/my-summary', protect, getMySummary);
router.get('/my-graph', protect, getMyGraph);

module.exports = router;