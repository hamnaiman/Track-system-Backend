// controllers/customerController.js

const Customer = require("../models/customerModel");

// Create Customer
exports.createCustomer = async (req, res) => {
  try {
    const {
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
      contactPersons
    } = req.body;

    if (!customerName) {
      return res.status(400).json({ message: "Customer name is required" });
    }

    const existing = await Customer.findOne({
      customerName: customerName.trim()
    });

    if (existing) {
      return res.status(400).json({ message: "Customer already exists" });
    }

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
      contactPersons
    });

    res.status(201).json({
      message: "Customer created successfully",
      data: customer
    });

  } catch (err) {
    console.error("Create Customer Error:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
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
      .sort({ customerName: 1 });

    res.status(200).json({
      success: true,
      count: customers.length,
      data: customers
    });

  } catch (err) {
    console.error("Get Customers Error:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

// Update Customer
exports.updateCustomer = async (req, res) => {
  try {
    const updateData = req.body;

    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({
      message: "Customer updated successfully",
      data: customer
    });

  } catch (err) {
    console.error("Update Customer Error:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

// Delete Customer
exports.deleteCustomer = async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);

    res.json({
      message: "Customer deleted successfully"
    });

  } catch (err) {
    console.error("Delete Customer Error:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};
