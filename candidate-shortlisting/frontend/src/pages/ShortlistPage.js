import React, { useState } from 'react';
import JobRequirementForm from '../components/JobRequirementForm';
import CandidateCard from '../components/CandidateCard';
import MatchScoreChart from '../components/MatchScoreChart';
import { shortlistCandidates, aiShortlist } from '../services/api';

function ShortlistPage() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState(null); // 'basic' | 'ai'
  const [savedCandidates, setSavedCandidates] = useState([]);

  const handleBasicShortlist = async (payload) => {
    setLoading(true);
    setError(null);
    setResults(null);
    setMode('basic');
    try {
      const { data } = await shortlistCandidates(payload);
      setResults(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to shortlist candidates.');
    } finally {
      setLoading(false);
    }
  };

  const handleAiShortlist = async (payload) => {
    setAiLoading(true);
    setError(null);
    setResults(null);
    setMode('ai');
    try {
      const { data } = await aiShortlist(payload);
      setResults(data);
    } catch (err) {
      setError(err.response?.data?.message || 'AI shortlisting failed. Check your OpenRouter API key.');
    } finally {
      setAiLoading(false);
    }
  };

  const toggleSave = (candidate) => {
    setSavedCandidates((prev) => {
      const exists = prev.find((c) => c._id === candidate._id);
      if (exists) return prev.filter((c) => c._id !== candidate._id);
      return [...prev, candidate];
    });
  };

  const isSaved = (id) => savedCandidates.some((c) => c._id === id);

  const high = results?.candidates?.filter((c) => c.matchTier === 'High') || [];
  const partial = results?.candidates?.filter((c) => c.matchTier === 'Partial') || [];
  const low = results?.candidates?.filter((c) => c.matchTier === 'Low') || [];

  return (
    <div>
      <JobRequirementForm
        onBasicShortlist={handleBasicShortlist}
        onAiShortlist={handleAiShortlist}
        loading={loading}
        aiLoading={aiLoading}
      />

      {error && <div className="alert alert-error">⚠️ {error}</div>}

      {(loading || aiLoading) && (
        <div className="loading">
          {aiLoading ? '🤖 AI is analyzing candidates...' : '⚡ Matching candidates...'}
        </div>
      )}

      {results && (
        <>
          <div className="card">
            <div className="card-title">
              {mode === 'ai' ? '🤖 AI Shortlist Results' : '⚡ Basic Shortlist Results'}
              {results.model && (
                <span style={{ fontSize: '0.78rem', fontWeight: 400, color: '#a0aec0', marginLeft: 8 }}>
                  via {results.model}
                </span>
              )}
            </div>

            <div className="results-summary">
              <span className="stat-pill">📋 {results.total} Total</span>
              <span className="stat-pill" style={{ background: '#f0fff4', color: '#276749' }}>
                🟢 {high.length} High
              </span>
              <span className="stat-pill" style={{ background: '#fffaf0', color: '#975a16' }}>
                🟡 {partial.length} Partial
              </span>
              <span className="stat-pill" style={{ background: '#fff5f5', color: '#c53030' }}>
                🔴 {low.length} Low
              </span>
            </div>

            {results.candidates.length === 0 ? (
              <div className="empty-state">
                <div className="icon">🔍</div>
                <p>No candidates found. Add some from the "Add Candidate" page.</p>
              </div>
            ) : (
              <>
                {high.length > 0 && (
                  <>
                    <p className="section-heading">🟢 High Match</p>
                    {high.map((c, i) => (
                      <div key={c._id} style={{ position: 'relative' }}>
                        <CandidateCard
                          candidate={c}
                          showMatchInfo
                          showAiInfo={mode === 'ai'}
                          rank={i + 1}
                        />
                        <button
                          className="btn btn-secondary"
                          style={{ position: 'absolute', top: 12, right: 12, padding: '0.25rem 0.6rem', fontSize: '0.78rem' }}
                          onClick={() => toggleSave(c)}
                        >
                          {isSaved(c._id) ? '★ Saved' : '☆ Save'}
                        </button>
                      </div>
                    ))}
                  </>
                )}
                {partial.length > 0 && (
                  <>
                    <p className="section-heading">🟡 Partial Match</p>
                    {partial.map((c, i) => (
                      <div key={c._id} style={{ position: 'relative' }}>
                        <CandidateCard
                          candidate={c}
                          showMatchInfo
                          showAiInfo={mode === 'ai'}
                          rank={high.length + i + 1}
                        />
                        <button
                          className="btn btn-secondary"
                          style={{ position: 'absolute', top: 12, right: 12, padding: '0.25rem 0.6rem', fontSize: '0.78rem' }}
                          onClick={() => toggleSave(c)}
                        >
                          {isSaved(c._id) ? '★ Saved' : '☆ Save'}
                        </button>
                      </div>
                    ))}
                  </>
                )}
                {low.length > 0 && (
                  <>
                    <p className="section-heading">🔴 Low Match</p>
                    {low.map((c, i) => (
                      <div key={c._id} style={{ position: 'relative' }}>
                        <CandidateCard
                          candidate={c}
                          showMatchInfo
                          showAiInfo={mode === 'ai'}
                          rank={high.length + partial.length + i + 1}
                        />
                        <button
                          className="btn btn-secondary"
                          style={{ position: 'absolute', top: 12, right: 12, padding: '0.25rem 0.6rem', fontSize: '0.78rem' }}
                          onClick={() => toggleSave(c)}
                        >
                          {isSaved(c._id) ? '★ Saved' : '☆ Save'}
                        </button>
                      </div>
                    ))}
                  </>
                )}
              </>
            )}
          </div>

          {results.candidates.length > 0 && <MatchScoreChart candidates={results.candidates} />}

          {savedCandidates.length > 0 && (
            <div className="card" style={{ border: '2px solid #667eea' }}>
              <div className="card-title">⭐ Saved Shortlist ({savedCandidates.length})</div>
              {savedCandidates.map((c) => (
                <CandidateCard
                  key={c._id}
                  candidate={c}
                  showMatchInfo
                  showAiInfo={mode === 'ai'}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ShortlistPage;
