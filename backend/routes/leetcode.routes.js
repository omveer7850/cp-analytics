const express  = require('express');
const router   = express.Router();
const leetcode = require('../controllers/leetcodeController');

router.get('/profile/:username', leetcode.getProfile);

module.exports = router;
