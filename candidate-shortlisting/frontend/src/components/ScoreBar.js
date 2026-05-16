import React from 'react';

function ScoreBar({ score, label, isAi = false }) {
  return (
    <div className="score-bar-wrap">
      <div className="score-bar-label">
        <span>{label}</span>
        <span>{score}%</span>
      </div>
      <div className="score-bar-track">
        <div
          className={`score-bar-fill${isAi ? ' ai' : ''}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export default ScoreBar;
