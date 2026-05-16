const express = require('express');
const router = express.Router();
const { shortlistCandidates } = require('../controllers/matchController');

// POST /api/match - Basic shortlisting
router.post('/', shortlistCandidates);

module.exports = router;
