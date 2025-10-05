const express = require("express");
const { getFlares } = require("../controllers/flareControllerOptimized");


const router = express.Router();

router.get("/", getFlares);

module.exports = router;
