const express = require("express");
const { predictFlare } = require("../controllers/predictController");
const router = express.Router();

// POST /api/predict
router.post("/", predictFlare);

module.exports = router;
