# RealTime Weather App

A full-stack web application that supports user authentication, real-time flowchart editing, and profile management. Built using **React**, **Node.js**, **MongoDB**, and **Socket.IO/EventSource**.

---

## Features

-  User Authentication (OTP via Email)
-  Real-Time Weather Data Visualization
- Real-time Collaboration via  SSE
- User Profile Management
- Protected Routes with JWT
- Flowchart Builder 

---

##  Tech Stack

**Frontend**:
- React (Vite)
- TailwindCSS
- Context API
- Axios

**Backend**:
- Node.js / Express
- MongoDB (Mongoose)
- Nodemailer (for OTP emails)
- JSON Web Tokens (JWT)
- SSE

---

## 🧪 Local Development Setup

### Prerequisites

- Node.js (v18+)
- MongoDB

### 1. Clone the repository

```bash
git clone https://github.com/ashleygracethomas/weather/tree/master
cd weather
2. Backend Setup
cd server
npm install
npm run dev
Create a .env file with:
PORT=5000
MONGO_URI=mongodb://localhost:27017/auth-app
JWT_SECRET=ashley_grace_thomas
PORT=5000

# Optional for real email
EMAIL_USER=ashleygracethomas11@gmail.com
EMAIL_PASS=ateh ckoi jrbw hkum
3. Frontend Setup
cd client
npm install
npm run dev
📁 Folder Structure
Server (Backend)
server/
├── config/
├── controllers/
│   ├── authController.js
│   └── flowController.js
├── middleware/
├── models/
│   └── User.js
├── routes/
│   └── auth.js
├── utils/
├── server.js
Client (Frontend)
client/
├── src/
│   ├── api/
│   ├── assets/
│   ├── auth/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Layout.jsx
│   │   └── Sidebar.jsx
│   ├── context/
│   ├── features/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── flowbuilder/
│   │   └── profile/
│   └── RealTime/
📡 API Endpoints
Auth
POST /api/auth/signup - Register user

POST /api/auth/send-otp - Send OTP via email

POST /api/auth/verify-otp - Verify OTP

POST /api/auth/login - Login

GET /api/auth/profile - Get user profile (JWT protected)

Simulator Control
•	POST /api/control – Start or stop the weather simulator
•	GET /api/status – Get current simulator status

Data
•	GET /sse – Real-time weather updates (via SSE)
•	GET /api/historical – Fetch historical data

Flow API
•	POST /api/flow/save - Save a new flowchart

•	GET /api/flow/load/:weatherType - Load all flowcharts by weather type

•	GET /api/flow/:id - Get single flowchart by ID

•	PUT /api/flow/update/:id - Update a flowchart


•	DELETE /api/flow/delete/:id - 
•	PUT /api/flow/:flowId/delete-node/:nodeId - 

