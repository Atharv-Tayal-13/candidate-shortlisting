import React, { useState } from 'react';
import SkillInput from './SkillInput';

function JobRequirementForm({ onBasicShortlist, onAiShortlist, loading, aiLoading }) {
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [preferredSkills, setPreferredSkills] = useState([]);
  const [minExperience, setMinExperience] = useState('');

  const buildPayload = () => ({
    requiredSkills,
    minExperience: minExperience !== '' ? Number(minExperience) : 0,
    preferredSkills,
  });

  const handleBasic = (e) => {
    e.preventDefault();
    if (requiredSkills.length === 0) return;
    onBasicShortlist(buildPayload());
  };

  const handleAi = (e) => {
    e.preventDefault();
    if (requiredSkills.length === 0) return;
    onAiShortlist(buildPayload());
  };

  return (
    <div className="card">
      <div className="card-title">🔍 Job Requirements</div>

      <div className="form-group">
        <label className="form-label">Required Skills *</label>
        <SkillInput
          skills={requiredSkills}
          onChange={setRequiredSkills}
          placeholder="e.g. React (press Enter)"
          tagClass="tag tag-green"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Preferred Skills (bonus)</label>
        <SkillInput
          skills={preferredSkills}
          onChange={setPreferredSkills}
          placeholder="e.g. AWS (press Enter)"
          tagClass="tag tag-purple"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Minimum Experience (years)</label>
        <input
          type="number"
          className="form-input"
          value={minExperience}
          onChange={(e) => setMinExperience(e.target.value)}
          min="0"
          placeholder="0"
          style={{ maxWidth: 160 }}
        />
      </div>

      {requiredSkills.length === 0 && (
        <p style={{ fontSize: '0.83rem', color: '#e53e3e', marginBottom: '0.75rem' }}>
          Add at least one required skill to shortlist.
        </p>
      )}

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button
          className="btn btn-primary"
          onClick={handleBasic}
          disabled={loading || requiredSkills.length === 0}
        >
          {loading ? '⏳ Matching...' : '⚡ Basic Shortlist'}
        </button>
        <button
          className="btn btn-ai"
          onClick={handleAi}
          disabled={aiLoading || requiredSkills.length === 0}
        >
          {aiLoading ? '🤖 AI Working...' : '🤖 AI Shortlist'}
        </button>
      </div>
    </div>
  );
}

export default JobRequirementForm;
