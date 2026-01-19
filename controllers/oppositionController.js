const Opposition = require("../models/oppositionModel");
const Application = require("../models/applicationModel");

/* =====================================================
   CREATE OPPOSITION
   ===================================================== */
exports.createOpposition = async (req, res) => {
  try {
    const {
      oppositionNumber,
      fileNumber,
      applicationNumber,
      oppositionDate,
      oppositionType,
      status,
      remarks,
      otherSide
    } = req.body;

    if (!oppositionNumber || !applicationNumber || !oppositionDate) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const exists = await Opposition.findOne({ oppositionNumber });
    if (exists) {
      return res.status(409).json({ message: "Opposition already exists" });
    }

    const app = await Application.findOne({ applicationNumber });
    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    const opposition = await Opposition.create({
      oppositionNumber,
      fileNumber,
      applicationNumber,

      clientId: app.client,
      trademark: app.trademark,
      trademarkStatus: app.status,
      class: app.class,
      goods: app.goods,
      periodOfUse: app.periodOfUse,

      trademarkJournalNumber: app.trademarkJournalNumber,
      journalDate: app.journalDate,
      publicationDate: app.publicationDate,

      oppositionDate,
      oppositionType: oppositionType || "Opponent",
      status: status || "Pending",
      remarks,
      otherSide,

      createdBy: req.user._id
    });

    res.status(201).json(opposition);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   GET ALL OPPOSITIONS
   ===================================================== */
exports.getOppositions = async (req, res) => {
  const data = await Opposition.find()
    .populate("clientId", "customerName")
    .sort({ createdAt: -1 });

  res.json(data);
};

/* =====================================================
   GET SINGLE OPPOSITION
   ===================================================== */
exports.getOppositionByNumber = async (req, res) => {
  const data = await Opposition.findOne({
    oppositionNumber: req.params.oppositionNumber
  })
    .populate("clientId", "customerName")
    .populate("proceedings.createdBy", "name")
    .populate("hearings.createdBy", "name");

  if (!data) {
    return res.status(404).json({ message: "Opposition not found" });
  }

  res.json(data);
};

/* =====================================================
   UPDATE OPPOSITION
   ===================================================== */
exports.updateOpposition = async (req, res) => {
  const updated = await Opposition.findOneAndUpdate(
    { oppositionNumber: req.params.oppositionNumber },
    { $set: req.body },
    { new: true }
  );

  if (!updated) {
    return res.status(404).json({ message: "Opposition not found" });
  }

  res.json(updated);
};

/* =====================================================
   DELETE ENTIRE OPPOSITION
   ===================================================== */
exports.deleteOpposition = async (req, res) => {
  try {
    const deleted = await Opposition.findOneAndDelete({
      oppositionNumber: req.params.oppositionNumber
    });

    if (!deleted) {
      return res.status(404).json({ message: "Opposition not found" });
    }

    res.json({
      success: true,
      message: "Opposition deleted successfully"
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   ADD PROCEEDING
   ===================================================== */
exports.addProceeding = async (req, res) => {
  const { date, remark } = req.body;

  if (!date || !remark) {
    return res.status(400).json({ message: "Date and remark required" });
  }

  const opposition = await Opposition.findOne({
    oppositionNumber: req.params.oppositionNumber
  });

  if (!opposition) {
    return res.status(404).json({ message: "Opposition not found" });
  }

  opposition.proceedings.push({
    date,
    remark,
    createdBy: req.user._id
  });

  await opposition.save();
  res.json(opposition);
};

/* =====================================================
   DELETE PROCEEDING (UPDATED)
   ===================================================== */
exports.deleteProceeding = async (req, res) => {
  try {
    const { oppositionNumber, proceedingId } = req.params;

    const opposition = await Opposition.findOne({ oppositionNumber });
    if (!opposition) {
      return res.status(404).json({ message: "Opposition not found" });
    }

    const before = opposition.proceedings.length;

    opposition.proceedings = opposition.proceedings.filter(
      (p) => p._id.toString() !== proceedingId
    );

    if (before === opposition.proceedings.length) {
      return res.status(404).json({ message: "Proceeding not found" });
    }

    await opposition.save();

    res.json({
      success: true,
      message: "Proceeding deleted successfully"
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   ADD HEARING
   ===================================================== */
exports.addHearing = async (req, res) => {
  const { hearingDate, before, comments } = req.body;

  if (!hearingDate) {
    return res.status(400).json({ message: "Hearing date required" });
  }

  const opposition = await Opposition.findOne({
    oppositionNumber: req.params.oppositionNumber
  });

  if (!opposition) {
    return res.status(404).json({ message: "Opposition not found" });
  }

  opposition.hearings.push({
    hearingDate,
    before,
    comments,
    createdBy: req.user._id
  });

  await opposition.save();
  res.json(opposition);
};

/* =====================================================
   DELETE HEARING (UPDATED)
   ===================================================== */
exports.deleteHearing = async (req, res) => {
  try {
    const { oppositionNumber, hearingId } = req.params;

    const opposition = await Opposition.findOne({ oppositionNumber });
    if (!opposition) {
      return res.status(404).json({ message: "Opposition not found" });
    }

    const before = opposition.hearings.length;

    opposition.hearings = opposition.hearings.filter(
      (h) => h._id.toString() !== hearingId
    );

    if (before === opposition.hearings.length) {
      return res.status(404).json({ message: "Hearing not found" });
    }

    await opposition.save();

    res.json({
      success: true,
      message: "Hearing deleted successfully"
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   ADD REMINDER
   ===================================================== */
exports.addReminder = async (req, res) => {
  const { date, text } = req.body;

  if (!date || !text) {
    return res.status(400).json({ message: "Reminder date & text required" });
  }

  const opposition = await Opposition.findOne({
    oppositionNumber: req.params.oppositionNumber
  });

  if (!opposition) {
    return res.status(404).json({ message: "Opposition not found" });
  }

  opposition.reminders.push({ date, text });
  await opposition.save();

  res.json(opposition);
};

/* =====================================================
   DELETE REMINDER (UPDATED)
   ===================================================== */
exports.deleteReminder = async (req, res) => {
  try {
    const { oppositionNumber, reminderId } = req.params;

    const opposition = await Opposition.findOne({ oppositionNumber });
    if (!opposition) {
      return res.status(404).json({ message: "Opposition not found" });
    }

    const before = opposition.reminders.length;

    opposition.reminders = opposition.reminders.filter(
      (r) => r._id.toString() !== reminderId
    );

    if (before === opposition.reminders.length) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    await opposition.save();

    res.json({
      success: true,
      message: "Reminder deleted successfully"
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
