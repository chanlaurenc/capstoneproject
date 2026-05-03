# Habit Streak Tracker

A full-stack web application for building and maintaining daily habits through streak tracking and friendly competition.

## Live URLs

- **Front-end:** https://chanlaurenc.github.io/capstoneproject/
- **Back-end API:** https://capstoneproject-production-6fc9.up.railway.app

## What It Does

Users can register an account, create personal habits with daily goals, and log their progress each day. Completing a habit's daily goal extends the streak. A public leaderboard shows the top streaks across all users.

## Features

- User registration and login with JWT authentication
- Create, edit, and delete personal habits
- Set a daily goal for each habit (e.g. drink water 8x per day)
- Log progress throughout the day — streak updates when the daily goal is met
- Dashboard with stats (total habits, completed today, best streak)
- Color-coded habit cards by category
- Anonymous public leaderboard with tie handling

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Front-end | Vue 3 (Vite, Options API) |
| State management | Pinia |
| Routing | Vue Router 4 |
| Back-end | Node.js + Express.js |
| Database | MongoDB Atlas + Mongoose |
| Authentication | JWT |
| Deployment | GitHub Pages (front-end) + Railway (back-end) |

## Local Setup

See [STEP-BY-STEP-GUIDE.md](./STEP-BY-STEP-GUIDE.md) for full setup instructions.

### Quick start

**Back-end:**
```bash
git clone https://github.com/chanlaurenc/capstoneproject.git
cd capstoneproject
npm install
# Create .env from .env.example and fill in your values
npm run dev
```

**Front-end:**
```bash
cd client
npm install
# Create client/.env from client/.env.example and fill in your values
npm run dev
```
