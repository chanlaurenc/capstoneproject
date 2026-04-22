# Habit Streak Tracker

## Project Overview
A full-stack habit tracking app where users can create habits, log daily completions, track streaks, and compete on a leaderboard.

## Tech Stack
- **Back-end:** Node.js + Express.js
- **Database:** MongoDB Atlas + Mongoose
- **Authentication:** JWT (jsonwebtoken + bcryptjs)
- **Front-end:** Vue 3 (Vite, Options API) + Vue Router 4 + Pinia

## Project Structure
```
capstoneproject/
├── src/
│   ├── index.js
│   ├── middleware/auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Habit.js
│   │   └── HabitLog.js
│   └── routes/
│       ├── auth.js
│       ├── habits.js
│       ├── dashboard.js
│       └── leaderboard.js
├── .env               ← never commit
├── .env.example
├── .gitignore
├── package.json
└── CLAUDE.md
```

## API Routes
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Log in, returns JWT |
| GET | /api/habits | Get all habits for logged-in user |
| POST | /api/habits | Create a new habit |
| PUT | /api/habits/:id | Update a habit |
| DELETE | /api/habits/:id | Delete a habit |
| POST | /api/habits/:id/log | Log habit complete for today (once per day) |
| GET | /api/dashboard | Get user dashboard data |
| GET | /api/leaderboard | Get top streaks across all users |

## Authentication
All routes except /api/auth/register and /api/auth/login require:
```
Authorization: Bearer <token>
```

## Key Logic
- Streak calculation is in `src/routes/habits.js` POST `/:id/log`
- A habit can only be logged once per day — enforced by a compound unique index on HabitLog `{ habitId, date }`
- Dates are normalized to midnight UTC before comparison

## Environment Variables
See `.env.example` for required variables. Never paste real values in this file.

## Running Locally
```bash
npm install
npm run dev
```
Server runs on port 3000.