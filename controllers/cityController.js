const City = require("../models/cityModel");
const Country = require("../models/countryModel");

// ---------------- ADD CITY ----------------
exports.createCity = async (req, res) => {
  try {
    const { countryId, name } = req.body;

    if (!countryId || !name) {
      return res.status(400).json({ message: "Country and City name required" });
    }

    // check if country exists
    const country = await Country.findById(countryId);
    if (!country) return res.status(400).json({ message: "Invalid countryId" });

    // check duplicate
    const exists = await City.findOne({
      countryId,
      name: name.trim()
    });

    if (exists)
      return res.status(400).json({ message: "City already exists in this country" });

    const city = await City.create({
      countryId,
      name: name.trim()
    });

    res.status(201).json({
      message: "City added successfully",
      data: city
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ---------------- GET CITIES (ALPHABETICAL) ----------------
exports.getCities = async (req, res) => {
  try {
    const { countryId } = req.query;

    if (!countryId)
      return res.status(400).json({ message: "countryId is required" });

    const cities = await City.find({ countryId }).sort({ name: 1 });

    res.json(cities);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- UPDATE CITY ----------------
exports.updateCity = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    if (!name)
      return res.status(400).json({ message: "City name is required" });

    const city = await City.findById(id);
    if (!city) return res.status(404).json({ message: "City not found" });

    // Check duplicate
    const duplicate = await City.findOne({
      countryId: city.countryId,
      name: name.trim(),
      _id: { $ne: id }
    });

    if (duplicate)
      return res.status(400).json({ message: "City already exists" });

    city.name = name.trim();
    await city.save();

    res.json({
      message: "City updated successfully",
      data: city
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ---------------- DELETE CITY ----------------
exports.deleteCity = async (req, res) => {
  try {
    await City.findByIdAndDelete(req.params.id);
    res.json({ message: "City deleted" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
