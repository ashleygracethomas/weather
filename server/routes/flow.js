const express = require("express");
const router = express.Router();
const FlowChart = require("../models/FlowChart");

// Create/save a new flowchart
router.post("/save", async (req, res) => {
  try {
    const { name, nodes, edges } = req.body;
    const flow = new FlowChart({ name, nodes, edges });
    await flow.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update flowchart
router.put("/:id", async (req, res) => {
  try {
    const { name, nodes, edges } = req.body;
    await FlowChart.findByIdAndUpdate(req.params.id, { name, nodes, edges });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get list of flowcharts
router.get("/list", async (req, res) => {
  try {
    const flows = await FlowChart.find({}, "_id name");
    res.json(flows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single flowchart by ID
router.get("/:id", async (req, res) => {
  try {
    const flow = await FlowChart.findById(req.params.id);
    res.json(flow);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete flowchart
router.delete("/:id", async (req, res) => {
  try {
    await FlowChart.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
