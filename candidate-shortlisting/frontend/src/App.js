import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import AddCandidatePage from './pages/AddCandidatePage';
import CandidateListPage from './pages/CandidateListPage';
import ShortlistPage from './pages/ShortlistPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="header">
          <div className="header-inner">
            <h1 className="logo">🎯 TalentMatch</h1>
            <nav className="nav">
              <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Add Candidate
              </NavLink>
              <NavLink to="/candidates" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                All Candidates
              </NavLink>
              <NavLink to="/shortlist" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Shortlist
              </NavLink>
            </nav>
          </div>
        </header>

        <main className="main">
          <Routes>
            <Route path="/" element={<AddCandidatePage />} />
            <Route path="/candidates" element={<CandidateListPage />} />
            <Route path="/shortlist" element={<ShortlistPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
