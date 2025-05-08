const mongoose = require("mongoose");

const flowSchema = new mongoose.Schema(
  {
    name: String,
    nodes: Array,
    edges: Array,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Flow", flowSchema); // collection: flows
