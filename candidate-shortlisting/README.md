# Candidate Profile Shortlisting System

A full-stack web app that filters and ranks candidates by skill match, with AI-powered suggestions via OpenRouter.

---

## Tech Stack

| Layer     | Technology                    |
|-----------|-------------------------------|
| Frontend  | React 18, React Router, Recharts |
| Backend   | Node.js, Express              |
| Database  | MongoDB (Mongoose)            |
| AI        | OpenRouter API                |

---

## Project Structure

```
candidate-shortlisting/
├── backend/
│   ├── config/         db.js
│   ├── controllers/    candidateController.js, matchController.js, aiController.js
│   ├── models/         Candidate.js
│   ├── routes/         candidateRoutes.js, matchRoutes.js, aiRoutes.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── public/         index.html
    ├── src/
    │   ├── components/ SkillInput, ScoreBar, CandidateCard, JobRequirementForm, MatchScoreChart
    │   ├── pages/      AddCandidatePage, CandidateListPage, ShortlistPage
    │   ├── services/   api.js
    │   ├── App.js
    │   └── index.js
    ├── .env.example
    └── package.json
```

---

## Setup Instructions

### Prerequisites

- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- An [OpenRouter](https://openrouter.ai/) account and API key

---

### 1. Clone / unzip the project

```bash
unzip candidate-shortlisting.zip
cd candidate-shortlisting
```

---

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/candidate-shortlisting
OPENROUTER_API_KEY=sk-or-xxxxxxxxxxxxxxxx
OPENROUTER_MODEL=openai/gpt-4o
```

- Get your key from https://openrouter.ai/keys
- For `OPENROUTER_MODEL`, any model on OpenRouter works (e.g. `openai/gpt-4o`, `anthropic/claude-3-haiku`, `mistralai/mistral-7b-instruct`)

Start the backend:

```bash
npm run dev     # with nodemon (auto-reload)
# or
npm start       # production
```

Backend runs at `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
cp .env.example .env
```

Edit `.env` if your backend is on a different host:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm start
```

Frontend runs at `http://localhost:3000`

---

## API Endpoints

### Candidate APIs

| Method | Endpoint              | Description               |
|--------|-----------------------|---------------------------|
| POST   | `/api/candidates`     | Add a new candidate       |
| GET    | `/api/candidates`     | Get all candidates        |
| GET    | `/api/candidates/:id` | Get a candidate by ID     |
| DELETE | `/api/candidates/:id` | Delete a candidate        |

**GET** supports query params: `?search=name&skill=React`

**POST body example:**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@gmail.com",
  "skills": ["React", "Node.js", "MongoDB"],
  "experience": 2,
  "bio": "Full-stack developer with e-commerce projects"
}
```

### Job Matching APIs

| Method | Endpoint           | Description                        |
|--------|--------------------|------------------------------------|
| POST   | `/api/match`       | Basic skill-overlap shortlisting   |
| POST   | `/api/ai/shortlist`| AI-powered candidate ranking       |

**POST body example:**
```json
{
  "requiredSkills": ["React", "Node.js"],
  "minExperience": 1,
  "preferredSkills": ["AWS", "TypeScript"]
}
```

---

## Features

- **Add Candidates** — Name, email, skills, experience, bio
- **View & Search** — Filter by name, email, or skill
- **Basic Shortlist** — Skill overlap scoring, experience check, High/Partial/Low tiers
- **AI Shortlist** — OpenRouter-powered ranking with explanations per candidate
- **Match Score Graph** — Bar chart using Recharts
- **Save Shortlist** — Star/save candidates for later reference

---

## Matching Logic

Candidates are scored as:

```
requiredScore = matchedRequired / totalRequired
preferredBonus = (matchedPreferred / totalPreferred) * 0.2
finalScore = min(requiredScore + preferredBonus, 1.0)
```

Tiers:
- **High** — score ≥ 75% AND meets min experience
- **Partial** — score ≥ 40% OR meets min experience
- **Low** — everything else

---

## Notes

- The AI shortlist feature requires a valid `OPENROUTER_API_KEY` in the backend `.env`
- MongoDB must be running before starting the backend
- The frontend proxies API calls to `http://localhost:5000` in development via `package.json`'s `"proxy"` field
