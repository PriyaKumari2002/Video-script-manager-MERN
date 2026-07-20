# Script Manager

A full-stack MERN application for managing YouTube and video scripts from idea to completion. It includes register/login authentication, private user workspaces, and CRUD features for adding, editing, deleting, filtering, and tracking scripts by status.

## Screenshots

### Login

![Login screen](docs/screenshots/login.png)

### Dashboard

![Dashboard](docs/screenshots/dashboard.png)

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
- Render backend deployment
- Vercel frontend deployment

## Run Locally

Install frontend dependencies:

```bash
npm install
npm run dev
```

In a second terminal, start the backend:

```bash
cd server
npm ci
npm run dev
```

Create `server/.env` with your Atlas database connection and a JWT secret of at least 32 characters:

```env
MONGO_URI=
JWT_SECRET=
PORT=5001
CLIENT_URLS=http://localhost:5173
```

## Deploy

Use these services:

- Backend: Render
- Frontend: Vercel
- Database: MongoDB Atlas

### Backend on Render

1. Create a MongoDB Atlas free cluster, create a database user, allow the Render service to access the cluster, and copy the connection string.
2. On Render, create a new Web Service from this GitHub repo.
3. Set root directory to `server`.
4. Set build command:

```bash
npm ci
```

5. Set start command:

```bash
npm start
```

6. Add environment variables:

```env
MONGO_URI=
JWT_SECRET=
NODE_ENV=production
CLIENT_URLS=
NODE_VERSION=20
```

Use the actual Render URL in `CLIENT_URLS` only after Vercel gives you the production URL. Do not add a trailing slash.

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
VITE_API_URL=
```

Set `VITE_API_URL` to your actual Render URL followed by `/api`, then redeploy the Vercel frontend. The Render health endpoint is `/api/health`.

## Resume Bullet

Built a MERN-based video script manager with user authentication and CRUD operations for creating, editing, deleting and tracking video scripts by status.
