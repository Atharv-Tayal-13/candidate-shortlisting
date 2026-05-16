import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts';

const COLORS = {
  High: '#38a169',
  Partial: '#d69e2e',
  Low: '#e53e3e',
};

function MatchScoreChart({ candidates }) {
  if (!candidates || candidates.length === 0) return null;

  const data = candidates.slice(0, 10).map((c) => ({
    name: c.name.split(' ')[0],
    matchScore: c.matchScore,
    aiScore: c.aiScore,
    tier: c.matchTier,
  }));

  return (
    <div className="card" style={{ marginTop: '1.5rem' }}>
      <div className="card-title">📊 Match Score Graph</div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#edf2f7" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} unit="%" />
          <Tooltip
            formatter={(value, name) => [`${value}%`, name === 'matchScore' ? 'Skill Match' : 'AI Score']}
          />
          <Legend formatter={(value) => (value === 'matchScore' ? 'Skill Match' : 'AI Score')} />
          <Bar dataKey="matchScore" name="matchScore" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[entry.tier] || '#667eea'} />
            ))}
          </Bar>
          {data.some((d) => d.aiScore != null) && (
            <Bar dataKey="aiScore" name="aiScore" fill="#f093fb" radius={[4, 4, 0, 0]} />
          )}
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
        {Object.entries(COLORS).map(([tier, color]) => (
          <span key={tier} style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 3, background: color }} />
            {tier} Match
          </span>
        ))}
      </div>
    </div>
  );
}

export default MatchScoreChart;
