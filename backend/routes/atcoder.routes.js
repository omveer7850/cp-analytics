const express = require('express');
const router  = express.Router();
const atcoder = require('../controllers/atcoderController');

router.get('/profile/:username',     atcoder.getProfile);
router.get('/history/:username',     atcoder.getHistory);
router.get('/submissions/:username', atcoder.getSubmissions);

module.exports = router;