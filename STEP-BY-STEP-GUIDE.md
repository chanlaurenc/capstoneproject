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
I used Claude as my primary AI assistant throughout this project. I chose not to use Claude Code as I felt the project scope was manageable through the web interface — I described what I was building, Claude generated the code, and I copied it into VS Code.

I created a `CLAUDE.md` file in the project root documenting the tech stack, file structure, and API routes in case I needed to switch to Claude Code later, but did not end up using it.

For anything I didn't understand (like the streak calculation logic or the compound unique index on HabitLog), I asked Claude to explain it and it walked me through the reasoning.

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
**Prerequisites**
- Back-end server running on port 3000
- Node.js v18 or higher (note: Vite 5 was used instead of the latest Vite due to Node v20.17.0 compatibility)
- npm v9 or higher

**1. Scaffold or clone the Vite project**

If cloning the existing repo, the `client/` folder is already scaffolded. Just install dependencies:

```bash
cd client
npm install
```

If starting from scratch, Vite 5 was used (not the latest) due to Node version compatibility:

```bash
npm create vite@5 client -- --template vue
cd client
npm install
npm install vue-router@4 pinia axios
```

**2. Set the VITE_API_URL environment variable**

Create a file called `client/.env` — this is listed in `.gitignore` and must never be committed.

Use `client/.env.example` as your template: VITE_API_URL=http://localhost:3000

**What this variable does:**

| Variable | Purpose |
|----------|---------|
| `VITE_API_URL` | The base URL of the back-end API. Set to `http://localhost:3000` for local development, and your Railway URL for production. |

All API calls in the Vue components reference this variable like so:
```js
axios.get(`${import.meta.env.VITE_API_URL}/api/dashboard`)
```

**3. Run the dev server**

Make sure you are inside the `client/` folder:

```bash
npm run dev
```

You should see: ```VITE v5.x.x  ready in xxx ms ➜  Local:   http://localhost:5173/```

**4. Verify the front-end connects to the back-end locally**

1. Open a separate terminal and start the back-end from the project root:
```bash
npm run dev
```
You should see `Connected to MongoDB Atlas` and `Server running on port 3000`

2. Open `http://localhost:5173` in your browser
3. You should see the Login page
4. Register a new account — if you are redirected to the dashboard and your habits load, the front-end is successfully connected to the back-end

**Common issues:**
- If you see `ERR_CONNECTION_REFUSED` in the browser console, the back-end is not running
- If you see a MongoDB connection error in the terminal, your IP may not be whitelisted in Atlas Network Access — add `0.0.0.0/0` to allow access from anywhere

**5. Project structure**
```
client/
├── src/
│   ├── components/
│   │   └── CreateHabit.vue
│   ├── router/
│   │   └── index.js
│   ├── stores/
│   │   └── auth.js
│   ├── views/
│   │   ├── Login.vue
│   │   ├── Register.vue
│   │   ├── Dashboard.vue
│   │   └── Leaderboard.vue
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── .env
├── .env.example
└── package.json
```

## Deployment
**Back-End Deployment (Railway)**

**Prerequisites**
- Railway account at [railway.app](https://railway.app) — sign up with GitHub
- Back-end code pushed to GitHub

**1. Create a new project**
1. Click **New Project**
2. Click **Deploy from GitHub repo**
3. Select your `capstoneproject` repository
4. Railway detects it as a Node.js project automatically

**2. Set environment variables**
1. Click on the service → **Variables** tab
2. Add the following variables:

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | Your full MongoDB Atlas connection string |
| `JWT_SECRET` | Your secret key |
| `PORT` | `8080` |

Railway manages the PORT internally — set it to 8080 to match what Railway expects.

**3. Set the start command**
1. Click **Settings** → scroll to **Deploy**
2. Set the start command to:
```bash
node src/index.js
```

**4. Generate a public URL**
1. Click **Settings** → scroll to **Networking**
2. Click **Generate Domain**
3. Your URL will look like: https://capstoneproject-production-xxxx.up.railway.app
4. Open it in your browser — you should see:
```json
{"message": "Habit Streak Tracker API is running"}
```

**5. Update CORS**
In `src/index.js`, update the CORS configuration to allow your GitHub Pages URL:
```js
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://chanlaurenc.github.io'
  ]
}))
```
Push this change — Railway redeploys automatically on every push to main.

### Front-End Deployment (GitHub Pages)

**Prerequisites**
- Back-end deployed to Railway and URL confirmed working
- `gh-pages` package installed in `client/`

**1. Install gh-pages**
From inside the `client/` folder:
```bash
npm install gh-pages --save-dev
```

**2. Update `client/vite.config.js`**
```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/capstoneproject/'
})
```

**3. Update `client/package.json`**
Add these two scripts:
```json
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```

**4. Update `client/.env` to point to Railway**
VITE_API_URL=https://capstoneproject-production-6fc9.up.railway.app

**5. Update Vue Router to use hash history**
In `src/router/index.js` change `createWebHistory` to `createWebHashHistory` — this is required because GitHub Pages does not support Vue Router's default history mode:
```js
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
```

**6. Deploy**
From inside the `client/` folder:
```bash
npm run deploy
```

This builds the app and pushes the `dist/` folder to a `gh-pages` branch on GitHub.

**7. Enable GitHub Pages**
1. Go to your GitHub repo → **Settings** → **Pages**
2. Under **Source** select **Deploy from a branch**
3. Select **gh-pages** branch → **Save**
4. Your live URL will be: https://chanlaurenc.github.io/capstoneproject/

**Common issues:**
- If the site is blank, make sure you are using `createWebHashHistory` in your router
- If API calls fail on the live site, check that `client/.env` has the Railway URL and that CORS includes `https://chanlaurenc.github.io`
- Railway redeploys automatically when you push to GitHub — no manual restart needed