import React from 'react';
import ScoreBar from './ScoreBar';

function CandidateCard({ candidate, onDelete, showMatchInfo = false, showAiInfo = false, rank }) {
  const tierClass =
    candidate.matchTier === 'High'
      ? 'tier-high'
      : candidate.matchTier === 'Partial'
      ? 'tier-partial'
      : candidate.matchTier === 'Low'
      ? 'tier-low'
      : '';

  return (
    <div className="candidate-card">
      <div className="candidate-header">
        <div>
          <div className="candidate-name">
            {rank != null && <span style={{ marginRight: 6, color: '#a0aec0' }}>#{rank}</span>}
            {candidate.name}
          </div>
          <div className="candidate-email">{candidate.email}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {candidate.matchTier && (
            <span className={`tag ${tierClass}`}>{candidate.matchTier} Match</span>
          )}
          {candidate.aiRank != null && (
            <span className="tag tag-purple">AI Rank #{candidate.aiRank}</span>
          )}
          {onDelete && (
            <button className="btn btn-danger" style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem' }} onClick={() => onDelete(candidate._id)}>
              Delete
            </button>
          )}
        </div>
      </div>

      <div className="candidate-meta">
        🏢 <strong>{candidate.experience}</strong> year{candidate.experience !== 1 ? 's' : ''} experience
        {candidate.meetsExperience === false && (
          <span className="tag tag-red" style={{ marginLeft: 8 }}>Below Min Exp</span>
        )}
      </div>

      <div>
        {candidate.skills.map((skill) => {
          const isMatched =
            candidate.matchedSkills &&
            candidate.matchedSkills.map((s) => s.toLowerCase()).includes(skill.toLowerCase());
          const isPreferred =
            candidate.matchedPreferredSkills &&
            candidate.matchedPreferredSkills.map((s) => s.toLowerCase()).includes(skill.toLowerCase());
          const cls = isMatched ? 'tag tag-green' : isPreferred ? 'tag tag-purple' : 'tag tag-blue';
          return (
            <span key={skill} className={cls}>
              {isMatched && '✓ '}{skill}
            </span>
          );
        })}
      </div>

      {candidate.bio && <div className="candidate-bio">"{candidate.bio}"</div>}

      {showMatchInfo && candidate.matchScore != null && (
        <div style={{ marginTop: '0.75rem' }}>
          <ScoreBar score={candidate.matchScore} label="Skill Match" />
        </div>
      )}

      {showAiInfo && candidate.aiScore != null && (
        <div style={{ marginTop: '0.5rem' }}>
          <ScoreBar score={candidate.aiScore} label="AI Score" isAi />
        </div>
      )}

      {showAiInfo && candidate.explanation && (
        <div className="ai-explanation">
          <strong>🤖 AI Recommendation</strong>
          {candidate.explanation}
        </div>
      )}
    </div>
  );
}

export default CandidateCard;
