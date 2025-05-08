const Flow = require("../models/FlowChart");

exports.saveFlow = async (req, res) => {
  const { name, nodes, edges } = req.body;
  const flow = new Flow({ name, nodes, edges });
  await flow.save();
  res.json({ success: true });
};

exports.updateFlow = async (req, res) => {
  const { name, nodes, edges } = req.body;
  await Flow.findByIdAndUpdate(req.params.id, { name, nodes, edges });
  res.json({ success: true });
};

exports.getFlows = async (req, res) => {
  const flows = await Flow.find({}, "_id name");
  res.json(flows);
};

exports.getFlowById = async (req, res) => {
  const flow = await Flow.findById(req.params.id);
  res.json(flow);
};

exports.deleteFlow = async (req, res) => {
  await Flow.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
