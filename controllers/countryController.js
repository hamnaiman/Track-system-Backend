const Country = require("../models/countryModel");

// Add country
exports.createCountry = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) return res.status(400).json({ message: "Country name is required" });

    const existing = await Country.findOne({ name: name.trim() });
    if (existing) return res.status(400).json({ message: "Country already exists" });

    const country = await Country.create({ name: name.trim() });

    res.status(201).json({
      message: "Country added successfully",
      data: country
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all countries sorted
exports.getCountries = async (req, res) => {
  try {
    const countries = await Country.find().sort({ name: 1 });
    res.json(countries);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update country
exports.updateCountry = async (req, res) => {
  try {
    const { name } = req.body;
    const country = await Country.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );

    res.json({ message: "Country updated", data: country });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete country
exports.deleteCountry = async (req, res) => {
  try {
    await Country.findByIdAndDelete(req.params.id);
    res.json({ message: "Country deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
