import React, { useState } from 'react';

function SkillInput({ skills, onChange, placeholder = 'Type a skill and press Enter', tagClass = 'tag tag-blue' }) {
  const [input, setInput] = useState('');

  const addSkill = () => {
    const trimmed = input.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
    }
    setInput('');
  };

  const removeSkill = (skill) => {
    onChange(skills.filter((s) => s !== skill));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill();
    } else if (e.key === 'Backspace' && input === '' && skills.length > 0) {
      removeSkill(skills[skills.length - 1]);
    }
  };

  return (
    <div>
      <div className="skill-input-row">
        <input
          type="text"
          className="form-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
        <button type="button" className="btn btn-secondary" onClick={addSkill}>
          Add
        </button>
      </div>
      {skills.length > 0 && (
        <div className="skill-tags">
          {skills.map((skill) => (
            <span key={skill} className={tagClass}>
              {skill}
              <span className="skill-tag-remove" onClick={() => removeSkill(skill)}>×</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default SkillInput;
