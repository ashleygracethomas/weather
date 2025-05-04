const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const sensorController = require("./controllers/sensorController");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.get("/sse", sensorController.handleSSE);
app.post("/api/control", sensorController.handleControl);
app.get("/api/historical", sensorController.handleHistoricalData);
app.get("/api/status", sensorController.handleStatus);

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/weather-station", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Error handling for MongoDB
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(3001, () => {
    console.log("Sensor simulator running on port 3001");
    console.log("Endpoints:");
    console.log("- POST /api/control (start/stop simulator)");
    console.log("- GET /api/historical (fetch historical data)");
    console.log("- GET /api/status (check simulator status)");
    console.log("- GET /sse (real-time data stream)");
  });
});
