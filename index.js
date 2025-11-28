require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const countryRoutes = require("./routes/countryRoutes");
// future: cityRoutes (when added)
// future: departmentRoutes
// etc...

// Connect to MongoDB
connectDB();

const app = express();

/* -------------------------------
   Global Middlewares (Security)
--------------------------------*/
app.use(helmet()); // Secure HTTP headers
app.use(cors()); // Allow frontend communication
app.use(express.json()); // JSON body parser
app.use(morgan("dev")); // Request logger

/* ------------------------------------
   Rate Limiter (Protection for Auth)
-------------------------------------*/
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100,
  message: "Too many requests from this IP, please try again later",
});
app.use("/api/auth", authLimiter);

/* ----------------------
   API ROUTES
-----------------------*/
app.use("/api/auth", authRoutes);          // login
app.use("/api/users", userRoutes);         // user create/list
app.use("/api/countries", countryRoutes);  // country setup
// app.use("/api/cities", cityRoutes);     // when added

/* -------------------------------
   Global Error Handler
--------------------------------*/
app.use((err, req, res, next) => {
  console.error(" Unhandled Error:", err);
  res.status(500).json({
    message: "Internal server error",
    error: err.message,
  });
});

/* -------------------------------
   Start Server
--------------------------------*/
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(` Server running on http://localhost:${PORT}`)
);
