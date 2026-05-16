const express = require('express');
const router = express.Router();
const { aiShortlist } = require('../controllers/aiController');

// POST /api/ai/shortlist - AI-based candidate suggestion
router.post('/shortlist', aiShortlist);

module.exports = router;
