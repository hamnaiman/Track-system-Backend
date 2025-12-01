const Hearing = require("../models/hearingModel");

// Create hearing parent record OR add new entry if exists
exports.addHearing = async (req, res) => {
  try {
    const { application, trademark, goods, hearingDate, before, commentsArguments, advocateAppeared } = req.body;

    if (!application || !hearingDate || !before) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    let hearing = await Hearing.findOne({ application });

    if (!hearing) {
      hearing = await Hearing.create({
        application,
        trademark,
        goods,
        hearings: [
          { hearingDate, before, commentsArguments, advocateAppeared }
        ]
      });

      return res.status(201).json({
        message: "Hearing record created",
        data: hearing
      });
    }

    hearing.hearings.push({
      hearingDate,
      before,
      commentsArguments,
      advocateAppeared
    });

    await hearing.save();

    res.status(201).json({
      message: "New hearing entry added",
      data: hearing
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// Get all hearing entries for one application
exports.getHearingByApplication = async (req, res) => {
  try {
    const hearing = await Hearing.findOne({ application: req.params.appId })
      .populate("application", "applicationNumber client trademark");

    if (!hearing) {
      return res.status(404).json({ message: "No hearing record found" });
    }

    res.status(200).json(hearing);

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// Update one hearing entry
exports.updateHearingEntry = async (req, res) => {
  try {
    const { hearingId } = req.params;

    const hearing = await Hearing.findOneAndUpdate(
      { "hearings._id": hearingId },
      {
        $set: {
          "hearings.$.hearingDate": req.body.hearingDate,
          "hearings.$.before": req.body.before,
          "hearings.$.commentsArguments": req.body.commentsArguments,
          "hearings.$.advocateAppeared": req.body.advocateAppeared
        }
      },
      { new: true }
    );

    if (!hearing) {
      return res.status(404).json({ message: "Hearing entry not found" });
    }

    res.json({ message: "Hearing updated", data: hearing });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// Delete one hearing entry
exports.deleteHearingEntry = async (req, res) => {
  try {
    const { hearingId } = req.params;

    const hearing = await Hearing.findOneAndUpdate(
      { "hearings._id": hearingId },
      { $pull: { hearings: { _id: hearingId } } },
      { new: true }
    );

    if (!hearing) {
      return res.status(404).json({ message: "Hearing entry not found" });
    }

    res.json({ message: "Entry deleted", data: hearing });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
