const express  = require('express');
const router   = express.Router();
const codechef = require('../controllers/codechefController');

router.get('/profile/:username', codechef.getProfile);

module.exports = router;