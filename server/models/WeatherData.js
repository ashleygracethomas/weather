const mongoose = require("mongoose");

const weatherDataSchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  windSpeed: Number,
  rainfall: Number,
  timestamp: { type: Date, default: Date.now }
});

weatherDataSchema.index({ timestamp: 1 });

module.exports = mongoose.model("WeatherData", weatherDataSchema);