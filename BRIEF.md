# Habit Streak Tracker

## The Problem It Solves
**Who uses this, and what does it let them do?**
I’ve found that starting habits is easy, but staying consistent over time is much harder without a clear way to track progress. This application helps users build and maintain daily habits by tracking streaks, reinforcing consistency, and providing simple motivation through visible progress.

## My Chosen Idea - Feature List
**3–5 core features**
- User authentication (register and login)
- Create and manage personal habits
- Log daily completion of habits (once per day)
- Private dashboard displaying current streaks and habit history
- Anonymous public leaderboard showing top streaks

## Data model
**List the MongoDB collections you expect to need and the key fields in each**
Users
- username (String)
- email (String)
- passwordHash (String)
- createdAt (Date)

Habits
- userId (ObjectId, ref: User)
- name (String)
- category (String)
- currentStreak (Number)
- lastCompletedDate (Date)
- createdAt (Date)

HabitLogs
- userId (ObjectId, ref: User)
- habitId (ObjectId, ref: Habit)
- date (Date)
- completed (Boolean)

## API Endpoint Table
**List every route you plan to build (method, path, what it does)**
| Method | Route | Description |
|-------|------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Log in a user and return JWT |
| GET | /api/habits | Get all habits for the logged-in user |
| POST | /api/habits | Create a new habit |
| DELETE | /api/habits/:id | Delete a habit |
| PUT | /api/habits/:id | Update a habit |
| POST | /api/habits/:id/log | Log completion for a habit (once per day) |
| GET | /api/dashboard | Get user dashboard data (habits + streaks) |
| GET | /api/leaderboard | Get top streaks across all users (anonymous) |

## Authentication
**Does your app need authentication? Yes or no, with one sentence of justification**
Yes, authentication is required because each user has their own private habits, streaks, and dashboard data that should not be accessible to others.