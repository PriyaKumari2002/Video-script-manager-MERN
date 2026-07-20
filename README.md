# Script Manager - Basic MERN Project

A simple fresher-level MERN project for managing YouTube/video scripts. It includes register/login authentication and basic CRUD: add, view, edit and delete scripts. Each user's scripts are kept separate using JWT authentication.

## Features

- Register and login
- Add video scripts
- Edit and delete saved scripts
- Track script status: Draft, Recording, Published
- Add tags like tech, hinglish, review

## Tech Stack

- React + Vite
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication

## Run Locally

Install frontend dependencies:

```bash
npm install
npm run dev
```

In a second terminal, start the backend:

```bash
cd server
npm install
npm run dev
```

If local MongoDB is not installed, the backend automatically starts a temporary local database for demo. Data resets when the backend stops.

For permanent local data, create `server/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/scriptflow
JWT_SECRET=any-long-random-string
PORT=5001
```

## Deploy

Use these services:

- Backend: Render
- Frontend: Vercel
- Database: MongoDB Atlas

### Backend on Render

1. Create a MongoDB Atlas free cluster and copy the connection string.
2. On Render, create a new Web Service from this GitHub repo.
3. Set root directory to `server`.
4. Set build command:

```bash
npm install
```

5. Set start command:

```bash
npm start
```

6. Add environment variables:

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=any_long_random_secret
NODE_ENV=production
```

After deploy, Render will give a backend URL like:

```text
https://your-app-name.onrender.com
```

The API URL for frontend will be:

```text
https://your-app-name.onrender.com/api
```

### Frontend on Vercel

1. Import the same GitHub repo in Vercel.
2. Keep framework as Vite.
3. Set build command:

```bash
npm run build
```

4. Set output directory:

```text
dist
```

5. Add environment variable:

```env
VITE_API_URL=https://your-render-backend-url.onrender.com/api
```

Then deploy. Register, login and CRUD will work using the deployed backend.

## Resume Bullet

Built a MERN-based video script manager with user authentication and CRUD operations for creating, editing, deleting and tracking video scripts by status.
