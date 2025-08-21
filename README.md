
# Global_Connect – Professional Networking Platform (MERN)

This repo is an MVP aligned to the provided spec. It includes:
- **Frontend**: React + Redux Toolkit + Tailwind CSS (Vercel-ready)
- **Backend**: Node.js + Express + MongoDB (Render/Railway/DigitalOcean ready)
- **Auth**: JWT (+ Google OAuth hook placeholder)
- **Core modules**: Auth, Profiles, Connections (basic), Posts/Feed, Jobs, Messaging (Socket.IO-ready, basic REST provided)

> Goal: ship a working baseline you can deploy quickly, then iterate.

---

## Quick Start (Local)

### Prereqs
- Node 18+
- MongoDB Atlas URI
- (Optional) Render or Railway account for backend; Vercel for frontend

### 1) Backend
```bash
cd backend
cp .env.sample .env   # fill values
npm install
npm run dev
```
The backend runs on `http://localhost:5000` by default.

### 2) Frontend
```bash
cd frontend
cp .env.sample .env   # set REACT_APP_API_URL=http://localhost:5000
npm install
npm run dev
```
The frontend runs on `http://localhost:5173` (Vite).

---

## Deploy

### Backend (Render)
1. Push to GitHub.
2. Create a new Render **Web Service**:
   - Build command: `npm install`
   - Start command: `node server.js`
   - Environment: Add `PORT`, `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN`.
3. Enable auto-deploys.

### Frontend (Vercel)
1. Import `frontend/` as a project.
2. Framework: **Vite** (React).
3. Add env: `REACT_APP_API_URL` (your Render backend URL).
4. Deploy.

---

## Features Implemented
- **Auth**: register/login with hashed passwords, JWT, auth middleware
- **Profiles**: get/update profile; add skills/experience/education
- **Connections**: request/accept list (basic, extend as needed)
- **Posts/Feed**: create post (text/image URL), like, comment, get feed
- **Messaging**: send/get messages REST; Socket.IO server bootstrap in `server.js`
- **Jobs**: create job, list jobs, apply
- **Validation**: minimal request validation
- **Security**: CORS, helmet-like headers (via Express defaults), HTTP-only tokens optional comment

> Google OAuth, notifications, admin tooling, uploads (GridFS/Cloudinary) are stubbed for future sprints.

---

## Structure

```
Global_Connect_MERN/
  backend/
    controllers/ models/ routes/ config/ middleware/
    server.js  package.json  .env.sample
  frontend/
    src/
      components/ pages/ slices/ store.js  App.jsx  index.jsx  utils/
    package.json  vite.config.js  tailwind.config.js  postcss.config.js  .env.sample
  shared/
    api.http
  README.md
```

---

## Notes
- File uploads are simplified to image URLs for MVP. Integrate Cloudinary later.
- Add Socket.IO client on the frontend and wire real-time chat when ready.
- Admin routes are not included in MVP; add as separate router (+ role field on User).
