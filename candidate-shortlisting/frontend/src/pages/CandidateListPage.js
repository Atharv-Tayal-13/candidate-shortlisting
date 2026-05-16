import React, { useState, useEffect, useCallback } from 'react';
import CandidateCard from '../components/CandidateCard';
import { getAllCandidates, deleteCandidate } from '../services/api';

function CandidateListPage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [error, setError] = useState(null);

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search) params.search = search;
      if (skillFilter) params.skill = skillFilter;
      const { data } = await getAllCandidates(params);
      setCandidates(data);
    } catch (err) {
      setError('Failed to load candidates. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, [search, skillFilter]);

  useEffect(() => {
    const t = setTimeout(fetchCandidates, 300);
    return () => clearTimeout(t);
  }, [fetchCandidates]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this candidate?')) return;
    try {
      await deleteCandidate(id);
      setCandidates((prev) => prev.filter((c) => c._id !== id));
    } catch {
      alert('Failed to delete candidate.');
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-title">👥 All Candidates</div>

        <div className="search-bar">
          <input
            className="form-input"
            placeholder="🔍 Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            className="form-input"
            placeholder="Filter by skill..."
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            style={{ maxWidth: 200 }}
          />
          <button className="btn btn-secondary" onClick={() => { setSearch(''); setSkillFilter(''); }}>
            Clear
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading">Loading candidates...</div>
        ) : candidates.length === 0 ? (
          <div className="empty-state">
            <div className="icon">👤</div>
            <p>No candidates found. Add some from the "Add Candidate" page.</p>
          </div>
        ) : (
          <>
            <p className="section-heading">{candidates.length} candidate{candidates.length !== 1 ? 's' : ''} found</p>
            {candidates.map((c) => (
              <CandidateCard key={c._id} candidate={c} onDelete={handleDelete} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default CandidateListPage;
