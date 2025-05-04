const WeatherData = require("../models/WeatherData");

let isSimulatorRunning = false;

const generateWeatherData = () => {
  return {
    temperature: (Math.random() * 30 + 10).toFixed(1), // 10-40°C
    humidity: (Math.random() * 50 + 30).toFixed(1), // 30-80%
    windSpeed: (Math.random() * 30).toFixed(1), // 0-30 km/h
    rainfall: (Math.random() * 10).toFixed(1), // 0-10 mm
    timestamp: new Date().toISOString(),
  };
};

const saveWeatherData = async (data) => {
  const doc = new WeatherData({
    temperature: parseFloat(data.temperature),
    humidity: parseFloat(data.humidity),
    windSpeed: parseFloat(data.windSpeed),
    rainfall: parseFloat(data.rainfall),
    timestamp: new Date(data.timestamp)
  });
  return await doc.save();
};

const getHistoricalData = async ({ startDate, endDate, page = 1, limit = 100 }) => {
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

  return {
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

const getSimulatorStatus = () => isSimulatorRunning;

const setSimulatorStatus = (status) => {
  isSimulatorRunning = status;
  return isSimulatorRunning;
};

module.exports = {
  generateWeatherData,
  saveWeatherData,
  getHistoricalData,
  getSimulatorStatus,
  setSimulatorStatus
};