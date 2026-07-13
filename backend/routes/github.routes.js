const express = require('express');
const router  = express.Router();
const github  = require('../controllers/githubController');

router.get('/profile/:username', github.getProfile);
router.get('/repos/:username',   github.getRepos);
router.get('/orgs/:username',    github.getOrgs);
router.get('/events/:username',  github.getEvents);

module.exports = router;