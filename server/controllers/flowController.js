const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Enhanced MongoDB Schema with validation
const flowSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  nodes: { 
    type: [{
      id: {
        type: String,
        required: true
      },
      type: {
        type: String,
        required: true,
        enum: ['weather', 'temperature', 'rainfall', 'humidity', 'wind']
      },
      position: {
        x: {
          type: Number,
          required: true
        },
        y: {
          type: Number,
          required: true
        }
      },
      // Corrected: Wrap `data` in a subdocument
      data: new mongoose.Schema({
        label: {
          type: String,
          required: true,
          trim: true,
          maxlength: 100
        },
        weatherType: {
          type: String,
          enum: ["temperature", "humidity", "wind", "rainfall", "general"]
        },
        editing: {
          type: Boolean,
          default: false
        }
      }, { _id: false }) // No _id for subdocuments
    }], 
    required: true,
    validate: {
      validator: function(nodes) {
        return nodes.length > 0;
      },
      message: 'At least one node is required'
    }
  },
  edges: { 
    type: [{
      id: {
        type: String,
        required: true
      },
      source: {
        type: String,
        required: true
      },
      target: {
        type: String,
        required: true
      },
      markerEnd: {
        type: String,
        enum: ['arrowclosed'],
        default: 'arrowclosed'
      }
    }], 
    required: true 
  },
  weatherType: {
    type: String,
    enum: ["temperature", "humidity", "wind", "rainfall", "general"],
    required: true,
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Add index for better query performance
flowSchema.index({ weatherType: 1, updatedAt: -1 });

const Flow = mongoose.model("Flow", flowSchema);

// Validation middleware
const validateFlow = (req, res, next) => {
  const { nodes, edges, weatherType } = req.body;
  if (!weatherType || !['temperature', 'humidity', 'wind', 'rainfall', 'general'].includes(weatherType)) {
    return res.status(400).json({ error: 'Invalid weather type' });
  }
  if (!Array.isArray(nodes) || nodes.length === 0) {
    return res.status(400).json({ error: 'Nodes must be a non-empty array' });
  }
  if (!Array.isArray(edges)) {
    return res.status(400).json({ error: 'Edges must be an array' });
  }

  for (const node of nodes) {
    if (!node.id || !node.type || !node.position || !node.data) {
      return res.status(400).json({ error: 'Invalid node structure' });
    }
    if (!node.data.label) {
      return res.status(400).json({ error: 'Each node must have a label' });
    }
  }

  for (const edge of edges) {
    if (!edge.id || !edge.source || !edge.target) {
      return res.status(400).json({ error: 'Invalid edge structure' });
    }
    if (!nodes.some(n => n.id === edge.source) || !nodes.some(n => n.id === edge.target)) {
      return res.status(400).json({ error: 'Edge connects to non-existent node' });
    }
  }

  next();
};

// Save a new flowchart
router.post("/flow/save", validateFlow, async (req, res) => {
  try {
    const { name, description, nodes, edges, weatherType } = req.body;
    const flow = new Flow({
      name,
      description,
      nodes: nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          editing: false
        }
      })),
      edges,
      weatherType
    });
    await flow.save();
    res.status(201).json({ 
      success: true,
      data: flow,
      message: "Flow saved successfully" 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Load all flowcharts by weather type
router.get("/flow/load/:weatherType", async (req, res) => {
  try {
    const flows = await Flow.find({ weatherType: req.params.weatherType })
      .sort({ updatedAt: -1 })
      .lean();
    res.json({
      success: true,
      data: flows.map(flow => ({
        ...flow,
        nodes: flow.nodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            editing: false
          }
        }))
      }))
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Get single flowchart by ID
router.get("/flow/:id", async (req, res) => {
  try {
    const flow = await Flow.findById(req.params.id).lean();
    if (!flow) {
      return res.status(404).json({ 
        success: false,
        error: "Flow not found" 
      });
    }
    res.json({
      success: true,
      data: {
        ...flow,
        nodes: flow.nodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            editing: false
          }
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Update a flowchart
router.put("/flow/update/:id", validateFlow, async (req, res) => {
  try {
    const { nodes, edges, name, description } = req.body;
    const flow = await Flow.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        nodes: nodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            editing: false
          }
        })),
        edges,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );
    if (!flow) {
      return res.status(404).json({ 
        success: false,
        error: "Flow not found" 
      });
    }
    res.json({ 
      success: true,
      data: flow 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Delete a flowchart
router.delete("/flow/delete/:id", async (req, res) => {
  try {
    const flow = await Flow.findByIdAndDelete(req.params.id);
    if (!flow) {
      return res.status(404).json({ 
        success: false,
        error: "Flow not found" 
      });
    }
    res.json({ 
      success: true,
      message: "Flow deleted successfully" 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Delete a node from a flowchart
router.put("/flow/:flowId/delete-node/:nodeId", async (req, res) => {
  try {
    const { flowId, nodeId } = req.params;
    const flow = await Flow.findById(flowId);
    if (!flow) {
      return res.status(404).json({ 
        success: false,
        error: "Flow not found" 
      });
    }

    // Remove the node
    flow.nodes = flow.nodes.filter(node => node.id !== nodeId);
    // Remove any edges connected to this node
    flow.edges = flow.edges.filter(
      edge => edge.source !== nodeId && edge.target !== nodeId
    );
    flow.updatedAt = Date.now();
    await flow.save();

    res.json({ 
      success: true,
      data: flow 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

module.exports = router;