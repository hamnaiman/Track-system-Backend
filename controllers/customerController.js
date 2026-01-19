// controllers/customerController.js

const Customer = require("../models/customerModel");
const bcrypt = require("bcryptjs");

// Create Customer
exports.createCustomer = async (req, res) => {
  try {
    const {
      partyType, customerName, address,
      city, country, phone, fax,
      email, web, businessType, agent,
      userName, password, contactPersons
    } = req.body;

    if (!customerName) {
      return res.status(400).json({ message: "Customer name is required" });
    }

    const existing = await Customer.findOne({ customerName: customerName.trim() });
    if (existing) {
      return res.status(400).json({ message: "Customer already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = await Customer.create({
      partyType,
      customerName,
      address,
      city,
      country,
      phone,
      fax,
      email,
      web,
      businessType,
      agent,
      userName,
      password: hashedPassword,
      contactPersons
    });

    res.status(201).json({
      message: "Customer created successfully",
      data: customer
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get All Customers
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find()
      .populate("city", "name")
      .populate("country", "name")
      .populate("businessType", "name")
      .populate("agent", "agentName")
      .select("-password")
      .sort({ customerName: 1 });

    res.status(200).json({
      success: true,
      count: customers.length,
      data: customers,
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update Customer
exports.updateCustomer = async (req, res) => {
  try {
    const updateData = req.body;

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({ message: "Customer updated", data: customer });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete Customer
exports.deleteCustomer = async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ message: "Customer deleted" });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
