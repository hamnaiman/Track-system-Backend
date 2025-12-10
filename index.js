/********************************************
 *  TRACK SYSTEM — BACKEND ENTRY FILE
 ********************************************/

require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const countryRoutes = require("./routes/countryRoutes");
const cityRoutes = require("./routes/cityRoutes");
const businessTypeRoutes = require("./routes/businessTypeRoutes");
const classRoutes = require("./routes/classRoutes");
const fileStatusRoutes = require("./routes/fileStatusRoutes");
const tmFormRoutes = require("./routes/tmFormRoutes");
const agentRoutes = require("./routes/agentRoutes");
const customerRoutes = require("./routes/customerRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const hearingRoutes = require("./routes/hearingRoutes");
const journalRoutes = require("./routes/journalRoutes");
const renewalRoutes = require("./routes/renewalRoutes");
const reportRoutes = require("./routes/reportRoutes");
const reportRenewalRoutes = require("./routes/reportRenewalRoutes");
const reminderReportRoutes = require("./routes/reminderReportRoutes");
const monthlyJournalRoutes = require("./routes/monthlyJournalRoutes");
const journalCompareRoutes = require("./routes/journalCompareRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const logoRoutes = require("./routes/logoRoutes");
const roleRoutes = require("./routes/roleRoutes");

connectDB();
const app = express();

/********************************************
 *  🔐 SECURITY MIDDLEWARE
 ********************************************/
app.use(helmet());

/********************************************
 *  🌍 CORS (Frontend Connection Allowed)
 ********************************************/
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

console.log("CORS Allowed Origin:", allowedOrigin);

/********************************************
 *  📦 GLOBAL MIDDLEWARE
 ********************************************/
app.use(express.json({ limit: "5mb" }));
app.use(morgan("dev"));

/********************************************
 *  🛑 RATE LIMITER (Login Protection)
 ********************************************/
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many login attempts, try again later.",
});
app.use("/api/auth", authLimiter);

/********************************************
 *  🚀 API ROUTES
 ********************************************/
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/countries", countryRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/business-types", businessTypeRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/file-statuses", fileStatusRoutes);
app.use("/api/tm-forms", tmFormRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/hearings", hearingRoutes);
app.use("/api/journals", journalRoutes);
app.use("/api/renewals", renewalRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/reports/renewals", reportRenewalRoutes);
app.use("/api/reports/reminders", reminderReportRoutes);
app.use("/api/monthly-journals", monthlyJournalRoutes);
app.use("/api/journal-compare", journalCompareRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/logo", logoRoutes);
app.use("/api/roles", roleRoutes);

/********************************************
 *  ❗ GLOBAL ERROR HANDLER
 ********************************************/
app.use((err, req, res, next) => {
  console.error("UNHANDLED ERROR:", err);
  return res.status(500).json({
    message: "Internal server error",
    error: err.message,
  });
});

/********************************************
 *  🏁 START SERVER
 ********************************************/
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
