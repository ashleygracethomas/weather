const mongoose = require("mongoose");

const flowChartSchema = new mongoose.Schema(
  {
    name: String,
    nodes: Array,
    edges: Array,
  },
  { timestamps: true }
);

module.exports = mongoose.model("FlowChart", flowChartSchema); // collection: flowcharts
