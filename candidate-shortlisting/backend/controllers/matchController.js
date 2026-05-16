const Candidate = require('../models/Candidate');

// Core matching logic as described in the document
function matchCandidates(candidates, job) {
  return candidates
    .map((candidate) => {
      const requiredSkillsLower = job.requiredSkills.map((s) => s.toLowerCase());
      const preferredSkillsLower = (job.preferredSkills || []).map((s) => s.toLowerCase());
      const candidateSkillsLower = candidate.skills.map((s) => s.toLowerCase());

      const matchedRequired = candidateSkillsLower.filter((skill) =>
        requiredSkillsLower.includes(skill)
      );
      const matchedPreferred = candidateSkillsLower.filter((skill) =>
        preferredSkillsLower.includes(skill)
      );

      const requiredScore =
        requiredSkillsLower.length > 0
          ? matchedRequired.length / requiredSkillsLower.length
          : 0;

      const preferredBonus =
        preferredSkillsLower.length > 0
          ? (matchedPreferred.length / preferredSkillsLower.length) * 0.2
          : 0;

      const score = Math.min(requiredScore + preferredBonus, 1);
      const meetsExperience = candidate.experience >= (job.minExperience || 0);

      let matchTier;
      if (score >= 0.75 && meetsExperience) matchTier = 'High';
      else if (score >= 0.4 || meetsExperience) matchTier = 'Partial';
      else matchTier = 'Low';

      return {
        _id: candidate._id,
        name: candidate.name,
        email: candidate.email,
        skills: candidate.skills,
        experience: candidate.experience,
        bio: candidate.bio,
        matchScore: Math.round(score * 100),
        matchedSkills: matchedRequired.map((s) => {
          const orig = candidate.skills.find((cs) => cs.toLowerCase() === s);
          return orig || s;
        }),
        matchedPreferredSkills: matchedPreferred.map((s) => {
          const orig = candidate.skills.find((cs) => cs.toLowerCase() === s);
          return orig || s;
        }),
        meetsExperience,
        matchTier,
      };
    })
    .sort((a, b) => {
      if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
      return b.experience - a.experience;
    });
}

const shortlistCandidates = async (req, res) => {
  try {
    const { requiredSkills, minExperience, preferredSkills } = req.body;

    if (!requiredSkills || !Array.isArray(requiredSkills) || requiredSkills.length === 0) {
      return res.status(400).json({ message: 'requiredSkills array is required' });
    }

    const candidates = await Candidate.find();
    const results = matchCandidates(candidates, {
      requiredSkills,
      minExperience: minExperience || 0,
      preferredSkills: preferredSkills || [],
    });

    res.json({
      total: results.length,
      job: { requiredSkills, minExperience, preferredSkills },
      candidates: results,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { shortlistCandidates, matchCandidates };
