require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const flowController = require("./controllers/flowController");

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Allow React app
    credentials: true,
  })
);

// Debug logging
console.log("Mongo URI:", process.env.MONGO_URI);

// Routes
app.use("/api/auth", authRoutes);
// Routes
app.use("/api",flowController);
// Start Server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
