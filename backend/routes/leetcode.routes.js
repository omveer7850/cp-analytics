const express = require('express');
const router = express.Router();
const leetcode = require('../controllers/leetcodeController');

router.get('/:username', leetcode.getProfile);
router.get('/:username/solved', leetcode.getSolved);
router.get('/:username/contest', leetcode.getContest);
router.get('/:username/calendar', leetcode.getCalendar);
router.get('/:username/submission', leetcode.getSubmissions);

module.exports = router;
