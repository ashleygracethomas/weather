// sensorSimulator.js
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

let isSimulatorRunning = false;
let dataGenerationInterval = null;

// Simulated weather data
const generateWeatherData = () => {
  return {
    temperature: (Math.random() * 30 + 10).toFixed(1), // 10-40°C
    humidity: (Math.random() * 50 + 30).toFixed(1), // 30-80%
    windSpeed: (Math.random() * 30).toFixed(1), // 0-30 km/h
    rainfall: (Math.random() * 10).toFixed(1), // 0-10 mm
    timestamp: new Date().toISOString(),
  };
};

// MongoDB connection
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/weather-station", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const weatherDataSchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  windSpeed: Number,
  rainfall: Number,
  timestamp: { type: Date, default: Date.now }
});

weatherDataSchema.index({ timestamp: 1 });
const WeatherData = mongoose.model("WeatherData", weatherDataSchema);

// SSE endpoint for real-time data
app.get("/sse", (req, res) => {
  if (!isSimulatorRunning) {
    return res.status(400).end("Simulator is not running");
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");

  const sendData = async () => {
    try {
      const data = generateWeatherData();
      const doc = new WeatherData({
        temperature: parseFloat(data.temperature),
        humidity: parseFloat(data.humidity),
        windSpeed: parseFloat(data.windSpeed),
        rainfall: parseFloat(data.rainfall),
        timestamp: new Date(data.timestamp)
      });
      await doc.save();
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    } catch (err) {
      console.error("Error saving data:", err);
    }
  };

  // Initial immediate emission
  sendData();
  
  // Periodic emissions
  const clientInterval = setInterval(sendData, 1000 + Math.random() * 1000);

  req.on("close", () => {
    clearInterval(clientInterval);
  });
});

// API to control simulator
app.post("/api/control", (req, res) => {
  const { action } = req.body;
  
  if (action === "start") {
    if (!isSimulatorRunning) {
      isSimulatorRunning = true;
      console.log("Simulator started");
      return res.json({ status: "started", message: "Simulator started" });
    }
    return res.json({ status: "already-running", message: "Simulator already running" });
  } 
  else if (action === "stop") {
    if (isSimulatorRunning) {
      isSimulatorRunning = false;
      console.log("Simulator stopped");
      return res.json({ status: "stopped", message: "Simulator stopped" });
    }
    return res.json({ status: "already-stopped", message: "Simulator already stopped" });
  }
  else {
    return res.status(400).json({ error: "Invalid action" });
  }
});

// API to fetch historical data with pagination and date filtering
app.get("/api/historical", async (req, res) => {
  try {
    const { startDate, endDate, page = 1, limit = 100 } = req.query;
    
    const query = {};
    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const options = {
      sort: { timestamp: -1 },
      skip: (page - 1) * limit,
      limit: parseInt(limit)
    };

    const data = await WeatherData.find(query, null, options);
    const total = await WeatherData.countDocuments(query);

    res.json({
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API to get simulator status
app.get("/api/status", (req, res) => {
  res.json({ isRunning: isSimulatorRunning });
});

// Error handling for MongoDB
mongoose.connection.on("error", err => {
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