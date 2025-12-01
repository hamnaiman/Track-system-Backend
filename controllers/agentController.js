const Agent = require("../models/agentModel");

// Create Agent
exports.createAgent = async (req, res) => {
  try {
    const { agentName, address, city, country, phone, fax, email, web, contactPersons } = req.body;

    if (!agentName || !address || !city || !country) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const agent = await Agent.create({
      agentName,
      address,
      city,
      country,
      phone,
      fax,
      email,
      web,
      contactPersons
    });

    res.status(201).json({ message: "Agent registered successfully", data: agent });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all Agents
exports.getAgents = async (req, res) => {
  try {
    const agents = await Agent.find().sort({ agentName: 1 });
    res.json(agents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Agent
exports.updateAgent = async (req, res) => {
  try {
    const updated = await Agent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Agent updated", data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Agent
exports.deleteAgent = async (req, res) => {
  try {
    await Agent.findByIdAndDelete(req.params.id);
    res.json({ message: "Agent deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
