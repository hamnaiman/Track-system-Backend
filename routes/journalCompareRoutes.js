const express = require("express");
const router = express.Router();

const { compareJournal } = require("../controllers/journalCompareController");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, compareJournal);

module.exports = router;
