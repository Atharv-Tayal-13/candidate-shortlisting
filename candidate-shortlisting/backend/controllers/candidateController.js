const Candidate = require('../models/Candidate');

// Add a new candidate
const addCandidate = async (req, res) => {
  try {
    const { name, email, skills, experience, bio } = req.body;

    if (!name || !email || experience === undefined) {
      return res.status(400).json({ message: 'Name, email, and experience are required' });
    }

    const existing = await Candidate.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Candidate with this email already exists' });
    }

    const candidate = await Candidate.create({ name, email, skills: skills || [], experience, bio: bio || '' });
    res.status(201).json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all candidates
const getAllCandidates = async (req, res) => {
  try {
    const { search, skill } = req.query;
    let filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (skill) {
      filter.skills = { $in: [new RegExp(skill, 'i')] };
    }

    const candidates = await Candidate.find(filter).sort({ createdAt: -1 });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single candidate
const getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    res.json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a candidate
const deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    res.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addCandidate, getAllCandidates, getCandidateById, deleteCandidate };
