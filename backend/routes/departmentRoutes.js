const express = require('express');
const router = express.Router();
const { getAll, getFlatList, getOne, create, update, delete: deleteDept, assignMember, getDayNames } = require('../controllers/departmentController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, admin, getAll);
router.get('/flat', protect, admin, getFlatList);
router.get('/days', protect, admin, getDayNames);
router.get('/:id', protect, admin, getOne);
router.post('/', protect, admin, create);
router.put('/:id', protect, admin, update);
router.delete('/:id', protect, admin, deleteDept);
router.post('/:departmentId/assign', protect, admin, assignMember);

module.exports = router;
