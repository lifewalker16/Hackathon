const express = require("express");
const { predictSummary } = require("../controllers/predictSummaryController");

const router = express.Router();

// POST /api/summary
router.post("/", predictSummary);

module.exports = router;
