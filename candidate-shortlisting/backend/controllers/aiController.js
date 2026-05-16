const fetch = require('node-fetch');
const Candidate = require('../models/Candidate');
const { matchCandidates } = require('./matchController');

const aiShortlist = async (req, res) => {
  try {
    const { requiredSkills, minExperience, preferredSkills } = req.body;

    if (!requiredSkills || !Array.isArray(requiredSkills) || requiredSkills.length === 0) {
      return res.status(400).json({ message: 'requiredSkills array is required' });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ message: 'OpenRouter API key is not configured' });
    }

    // Get all candidates and run basic match first
    const candidates = await Candidate.find();
    if (candidates.length === 0) {
      return res.json({ message: 'No candidates found', candidates: [] });
    }

    const basicMatches = matchCandidates(candidates, {
      requiredSkills,
      minExperience: minExperience || 0,
      preferredSkills: preferredSkills || [],
    });

    // Build the AI prompt (as shown in the document)
    const candidateList = basicMatches
      .map(
        (c, i) =>
          `${i + 1}. ${c.name} - Skills: ${c.skills.join(', ')} - Experience: ${c.experience} years${c.bio ? ` - Bio: ${c.bio}` : ''}`
      )
      .join('\n');

    const prompt = `
You are a technical recruiter assistant. Rank the following candidates for a job opening and explain your reasoning.

Job Requirements:
- Required Skills: ${requiredSkills.join(', ')}
- Minimum Experience: ${minExperience || 0} years
${preferredSkills && preferredSkills.length > 0 ? `- Preferred Skills: ${preferredSkills.join(', ')}` : ''}

Candidates:
${candidateList}

For each candidate:
1. Assign a rank (1 = best fit)
2. Give a match percentage (0-100)
3. Write a brief explanation (1-2 sentences) of why they are or aren't a good fit

Respond ONLY with a valid JSON array (no markdown, no extra text) in this exact format:
[
  {
    "name": "Candidate Name",
    "rank": 1,
    "aiScore": 85,
    "explanation": "Explanation here."
  }
]
`;

    const model = process.env.OPENROUTER_MODEL || 'openai/gpt-4o';

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Candidate Shortlisting System',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(502).json({ message: 'OpenRouter API error', details: errText });
    }

    const aiData = await response.json();
    const aiText = aiData.choices?.[0]?.message?.content || '[]';

    let aiResults = [];
    try {
      const cleaned = aiText.replace(/```json|```/g, '').trim();
      aiResults = JSON.parse(cleaned);
    } catch {
      return res.status(502).json({ message: 'Failed to parse AI response', raw: aiText });
    }

    // Merge AI results with basic match data
    const merged = basicMatches.map((candidate) => {
      const aiMatch = aiResults.find(
        (r) => r.name.toLowerCase() === candidate.name.toLowerCase()
      );
      return {
        ...candidate,
        aiRank: aiMatch?.rank ?? null,
        aiScore: aiMatch?.aiScore ?? null,
        explanation: aiMatch?.explanation ?? 'No AI explanation available.',
      };
    });

    // Sort by AI rank if available, else by matchScore
    merged.sort((a, b) => {
      if (a.aiRank !== null && b.aiRank !== null) return a.aiRank - b.aiRank;
      if (a.aiRank !== null) return -1;
      if (b.aiRank !== null) return 1;
      return b.matchScore - a.matchScore;
    });

    res.json({
      total: merged.length,
      job: { requiredSkills, minExperience, preferredSkills },
      model,
      candidates: merged,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { aiShortlist };
