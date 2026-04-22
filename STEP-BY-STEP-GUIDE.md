# STEP BY STEP GUIDE
This guide explains how to set up, run, and test the Habit Streak Tracker from scratch on a new machine.
## Back-end Setup
**Prerequisites**
- Node.js v18 or higher (check with ``node -v``)
- npm v9 or higher (check with ``npm -v``)
- VS Code with the Thunder Client extension installed
- nodemon is installed automatically as a dev dependency via ``npm install``
- A MongoDB Atlas account (free tier)
- Git installed

**Clone the Repository**
``
git clone https://github.com/chanlaurenc/capstoneproject.git
``
`` cd capstoneproject ``

**Install Dependencies**
``npm install``
This installs express, mongoose, bcryptjs, jsonwebtoken, dotenv, cors, and nodemon.

**Configure the ``.env`` File**
Create a file called ``.env`` in the root of the project. Never commit this file (it is already listed in .gitignore).

Use .env.example as your template:
``PORT=3000``
``MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/habit-tracker?retryWrites=true&w=majority``
``JWT_SECRET=your_secret_key_here``

What each variable does:
- PORT: The port the Express server listens on locally — 3000 works fine
- MONGODB_URI: Your full MongoDB Atlas connection string including your database username, password, cluster URL, and database name
- JWT_SECRET: A secret string used to sign and verify JWT tokens (make it long and random)

**AI Tooling**
I used Claude as my primary AI assistant throughout this project rather than Claude Code with a ``CLAUDE.md`` file.

My workflow was conversational: I described what I was building and Claude generated the full project structure — models, routes, middleware, and entry point — which I copied into VS Code. For anything I didn't understand (like the streak logic or the compound unique index on HabitLog), I asked Claude to explain it and it walked me through the reasoning.

For future reference: if using Claude Code in the terminal, you would create a ``CLAUDE.md`` file in the project root describing the tech stack, file structure, and any conventions. Since I used the web interface instead, no ``CLAUDE.md`` was needed.

**Set Up MongoDB Atlas**
1. Go to mongodb.com/atlas and create a free account
2. Click New Project, name it habit-tracker, click Create Project
3. Click Build a Database → select M0 Free tier → click Create Deployment
4. Go to Database Access → Add New Database User
    - Choose Password authentication
    - Set a username and password — save these, you'll need them in your connection string
    - Leave role as Atlas Admin → click Add User
5. Go to Network Access → Add IP Address → click Allow Access from Anywhere (0.0.0.0/0) → Confirm
6. Go to Database → click Connect on your cluster → choose Drivers
7. Copy the connection string — it looks like:

        mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority

8. Replace <username> and <password> with your database user credentials
9. Add the database name before the ?:

        mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/habit-tracker?retryWrites=true&w=majority

10. Paste this as the value of MONGODB_URI in your .env file

**Start the Server**
``npm run dev``

You should see:
    Connected to MongoDB Atlas
    Server running on port 3000

If you see a MongoDB connection error, check that:
- Your MONGODB_URI has the correct username and password
- Your IP is whitelisted under Network Access in Atlas (use 0.0.0.0/0 for development)

**Test Routes in Thunder Client**
Open Thunder Client in VS Code. Test each route in this order:

1. Register a user
    - Method: POST
    - URL: http://localhost:3000/api/auth/register
    - Body (JSON): 
    ``
    {
        "username": "testuser",
        "email": "test@example.com",
        "password": "password123"
    }
    ``
    - Expected: ``201 Created`` with a `token` and `user` object
    - Copy the token from the response because you need it for all remaining requests
2. Log in
    - Method: POST
    - URL: http://localhost:3000/api/auth/login
    - Body (JSON):
    `{
        "email": "test@example.com",
         "password": "password123"
    }`
    - Expected: 200 OK with a token
3. Adding the Authroization header

    For all requests below, go to the Headers tab in Thunder Client and add:
        - Key: Authorization
        - Value: Bearer `<paste your token here>`
4. Create a habit
    - Method: POST
    - URL: http://localhost:3000/api/habits
    - Body (JSON):
    `{
        "name": "Gym",
        "category": "Health",
        "goal": 1
    }`
    - Expected: 201 Created with the new habit object
    - Copy the _id from the response (you need it for the next step)
5. Log a habit as complete today
    - Method: POST
    - URL: http://localhost:3000/api/habits/<habit_id>/log
    - No body needed
    - Expected: 200 OK with the habit showing currentStreak: 1
6. Get dashboard data
    - Method: GET
    - URL: http://localhost:3000/api/dashboard
    - Expected: 200 OK with user info and habits array, each habit having a completedToday boolean
7. Get leaderboard
    - Method: GET
    - URL: http://localhost:3000/api/leaderboard
    - Expected: 200 OK with an array of ranked users and their top streaks
8. Update a habit
    - Method: PUT
    - URL: http://localhost:3000/api/habits/<habit_id>
    - Body (JSON):
    `{
        "name": "Morning Run",
        "category": "Fitness"
    }`
    - Expected: 200 OK with the updated habit
9. Delete a habit
    - Method: DELETE
    - URL: http://localhost:3000/api/habits/<habit_id>
    - Expected: 200 OK with "Habit deleted successfully"

## Front-end Setup

## Deployment