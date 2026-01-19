const Renewal = require("../models/renewalModel");
const Application = require("../models/applicationModel");

// Add Renewal Entry (grid update)
exports.addRenewalEntry = async (req, res) => {
  try {
    const { applicationId, renewedUpto, remark } = req.body;

    if (!applicationId || !renewedUpto) {
      return res.status(400).json({ message: "Application ID & Renewed Upto are required" });
    }

    const application = await Application.findById(applicationId);
    if (!application) return res.status(404).json({ message: "Application not found" });

    let renewal = await Renewal.findOne({ application: applicationId });

    if (!renewal) {
      renewal = await Renewal.create({
        application: applicationId,
        entries: [{ renewedUpto, remark }]
      });
    } else {
      renewal.entries.push({ renewedUpto, remark });
      await renewal.save();
    }

    res.status(201).json({
      message: "Renewal entry added",
      data: renewal
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get renewals by application
exports.getRenewals = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const renewal = await Renewal.findOne({ application: applicationId })
      .populate("application", "applicationNumber fileNumber trademark goods");

    res.json(renewal || { entries: [] });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete a renewal entry
exports.deleteRenewalEntry = async (req, res) => {
  try {
    const { renewalId, entryId } = req.params;

    const renewal = await Renewal.findById(renewalId);
    if (!renewal) return res.status(404).json({ message: "Record not found" });

    renewal.entries = renewal.entries.filter(e => e._id.toString() !== entryId);
    await renewal.save();

    res.json({ message: "Entry deleted", data: renewal });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
