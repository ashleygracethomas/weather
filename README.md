MERN Stack Real-Time Dashboard with OTP Auth and Flowchart Editor
Overview
This project is a comprehensive MERN stack application featuring:

User authentication with OTP via email/SMS

Real-time data visualization from a simulated sensor

Interactive flowchart editor with persistence

JWT-secured API endpoints

Technical Stack
Backend
Node.js with Express

MongoDB (Mongoose ODM)

Socket.IO for real-time communication

JWT for authentication

Nodemailer/Twilio for OTP delivery

Frontend
React (Vite)

React Router for navigation

Context API for state management

Recharts/Chart.js for data visualization

React-Flow for flowchart editing

Tailwind CSS for styling

Setup Instructions
Prerequisites
Node.js (v16 or higher)

MongoDB (local or Atlas URI)

NPM/Yarn

Twilio account (for SMS OTP) or email service (for email OTP)

Installation
Clone the repository:

bash
git clone https://github.com/yourusername/mern-otp-dashboard.git
cd mern-otp-dashboard
Set up the backend:

bash
cd server
npm install
Set up the frontend:

bash
cd ../client
npm install
Environment Configuration
Create a .env file in the server directory with the following variables:

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
OTP_SECRET=your_otp_secret_key
TWILIO_ACCOUNT_SID=your_twilio_sid (optional)
TWILIO_AUTH_TOKEN=your_twilio_token (optional)
EMAIL_SERVICE=your_email_service (e.g., 'Gmail')
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
PORT=5000
Running the Application
Start the backend server:

bash
cd server
npm start
Start the data simulator (in a separate terminal):

bash
cd server
node simulator/index.js
Start the frontend development server:

bash
cd ../client
npm run dev
The application should now be running:

Backend: http://localhost:5000

Frontend: http://localhost:5173

Simulator: Running in background emitting data every 1-2 seconds

API Endpoints
Auth API
POST /api/auth/signup - User registration

POST /api/auth/verify-otp - OTP verification

POST /api/auth/login - User login

GET /api/auth/profile - Get user profile (protected)

Data API
GET /api/data/live - Socket.IO connection for real-time data

GET /api/data/history - Get historical data (protected)

POST /api/data/start-simulator - Start data simulator (protected)

POST /api/data/stop-simulator - Stop data simulator (protected)

Flow API
POST /api/flow/save - Save flowchart (protected)

GET /api/flow/load - Load flowchart (protected)

PUT /api/flow/update - Update flowchart (protected)

Project Structure
/mern-otp-dashboard
│
├── /client
│   ├── /public
│   ├── /src
│   │   ├── /components
│   │   ├── /context
│   │   ├── /pages
│   │   ├── /utils
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── /server
│   ├── /config
│   ├── /controllers
│   ├── /middleware
│   ├── /models
│   ├── /routes
│   ├── /simulator
│   │   └── index.js
│   ├── /utils
│   ├── package.json
│   ├── server.js
│   └── .env
│
└── README.md
Features
User Authentication
Secure signup with OTP verification via email/SMS

JWT-based login system

Protected routes for authenticated users only

Real-Time Data Visualization
Simulated sensor data emitted every 1-2 seconds

Live-updating charts showing sensor readings

Historical data viewing capabilities

Interactive Flowchart Editor
Drag-and-drop node interface

Create, connect, and delete nodes

Save and load flowchart configurations

Real-time collaboration capabilities

AI Integration Report
This project leveraged AI tools in several ways:

Component Scaffolding: Used GitHub Copilot to generate initial React component structures

API Route Generation: ChatGPT helped create Express route templates

Utility Functions: AI assisted with JWT handlers and OTP generation logic

Styling Suggestions: TabNine provided Tailwind CSS class recommendations

Documentation: This README was drafted with AI assistance

Effective prompts included:

"Generate a React component for a real-time line chart using Chart.js"

"Create a Mongoose schema for user authentication with OTP"

"Show me how to implement Socket.IO for real-time data in Express"

"Suggest Tailwind classes for a responsive dashboard layout"

Demo Instructions
Sign up with your email/phone number

Verify the OTP received

Navigate to the Dashboard to view real-time data

Interact with the flowchart editor to create and save diagrams

View historical data in the Analytics section

Troubleshooting
OTP Not Received: Check spam folder or verify Twilio credentials

Socket Connection Issues: Ensure both server and client are running

Database Errors: Verify MongoDB connection string in .env

CORS Errors: Confirm frontend is running on correct port (5173 by default)
![image](https://github.com/user-attachments/assets/acdcfa51-cce0-49b2-96f0-c2994f7d970e)
