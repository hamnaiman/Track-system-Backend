require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");

const app = express();

// Connect MongoDB
connectDB();

// Middlewares
app.use(helmet());                // Security headers
app.use(cors());                  // Allow API access
app.use(express.json());          // Parse JSON
app.use(morgan("dev"));           // Logging

// Test Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Track System Backend is running ✔",
  });
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on PORT ${PORT}`);
});
