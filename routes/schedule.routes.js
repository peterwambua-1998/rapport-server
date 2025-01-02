const express = require('express');
const router = express.Router();
const { create, getSchedules, updateSchedule, getAllSchedules } = require('../controllers/schedule.controller')

router.post('/get', getSchedules)
router.post('/create', create)
router.put('/:id/status', updateSchedule)
router.get('/all', getAllSchedules)

module.exports = router