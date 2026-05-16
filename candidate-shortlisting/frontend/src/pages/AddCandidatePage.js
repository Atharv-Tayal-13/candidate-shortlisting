import React, { useState } from 'react';
import SkillInput from '../components/SkillInput';
import { addCandidate } from '../services/api';

function AddCandidatePage() {
  const [form, setForm] = useState({ name: '', email: '', experience: '', bio: '' });
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (!form.name || !form.email || form.experience === '') {
      setMessage({ type: 'error', text: 'Name, email, and experience are required.' });
      return;
    }
    setLoading(true);
    try {
      await addCandidate({ ...form, experience: Number(form.experience), skills });
      setMessage({ type: 'success', text: `Candidate "${form.name}" added successfully!` });
      setForm({ name: '', email: '', experience: '', bio: '' });
      setSkills([]);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to add candidate.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-title">➕ Add New Candidate</div>

        {message && (
          <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                name="name"
                className="form-input"
                value={form.name}
                onChange={handleChange}
                placeholder="Rahul Sharma"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                name="email"
                type="email"
                className="form-input"
                value={form.email}
                onChange={handleChange}
                placeholder="rahul@gmail.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Skills</label>
            <SkillInput
              skills={skills}
              onChange={setSkills}
              placeholder="e.g. React, Node.js (press Enter)"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Experience (years) *</label>
              <input
                name="experience"
                type="number"
                min="0"
                className="form-input"
                value={form.experience}
                onChange={handleChange}
                placeholder="2"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Bio / Projects (optional)</label>
              <input
                name="bio"
                className="form-input"
                value={form.bio}
                onChange={handleChange}
                placeholder="Brief description of projects..."
              />
            </div>
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? '⏳ Saving...' : '✅ Add Candidate'}
          </button>
        </form>
      </div>

      <div className="card" style={{ background: '#f8faff', border: '1px dashed #c3d3f0' }}>
        <div className="card-title" style={{ fontSize: '0.95rem' }}>📋 API Reference</div>
        <p style={{ fontSize: '0.85rem', color: '#4a5568', marginBottom: '0.5rem' }}>
          <strong>POST</strong> <code>/api/candidates</code> — Add a candidate
        </p>
        <pre style={{ fontSize: '0.8rem', background: '#edf2f7', borderRadius: 8, padding: '0.75rem', overflow: 'auto' }}>
{`{
  "name": "Rahul Sharma",
  "email": "rahul@gmail.com",
  "skills": ["React", "Node.js", "MongoDB"],
  "experience": 2,
  "bio": "Full-stack developer"
}`}
        </pre>
      </div>
    </div>
  );
}

export default AddCandidatePage;
