const sensorService = require("./sensorService");

const handleSSE = (req, res) => {
  if (!sensorService.getSimulatorStatus()) {
    return res.status(400).end("Simulator is not running");
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");

  const sendData = async () => {
    try {
      const data = sensorService.generateWeatherData();
      await sensorService.saveWeatherData(data);
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
};

const handleControl = (req, res) => {
  const { action } = req.body;
  
  if (action === "start") {
    if (!sensorService.getSimulatorStatus()) {
      sensorService.setSimulatorStatus(true);
      console.log("Simulator started");
      return res.json({ status: "started", message: "Simulator started" });
    }
    return res.json({ status: "already-running", message: "Simulator already running" });
  } 
  else if (action === "stop") {
    if (sensorService.getSimulatorStatus()) {
      sensorService.setSimulatorStatus(false);
      console.log("Simulator stopped");
      return res.json({ status: "stopped", message: "Simulator stopped" });
    }
    return res.json({ status: "already-stopped", message: "Simulator already stopped" });
  }
  else {
    return res.status(400).json({ error: "Invalid action" });
  }
};

const handleHistoricalData = async (req, res) => {
  try {
    const { startDate, endDate, page = 1, limit = 100 } = req.query;
    const result = await sensorService.getHistoricalData({ startDate, endDate, page, limit });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const handleStatus = (req, res) => {
  res.json({ isRunning: sensorService.getSimulatorStatus() });
};

module.exports = {
  handleSSE,
  handleControl,
  handleHistoricalData,
  handleStatus
};