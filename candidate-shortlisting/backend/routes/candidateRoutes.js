const express = require('express');
const router = express.Router();
const {
  addCandidate,
  getAllCandidates,
  getCandidateById,
  deleteCandidate,
} = require('../controllers/candidateController');

// POST /api/candidates - Add a candidate
router.post('/', addCandidate);

// GET /api/candidates - Get all candidates (supports ?search= and ?skill=)
router.get('/', getAllCandidates);

// GET /api/candidates/:id - Get one candidate
router.get('/:id', getCandidateById);

// DELETE /api/candidates/:id - Delete a candidate
router.delete('/:id', deleteCandidate);

module.exports = router;
