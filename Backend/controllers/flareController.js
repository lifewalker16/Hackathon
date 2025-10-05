const fetchSolarFlares = require("../config/nasaApi");
const Flare = require("../models/flareModel");

// GET /api/flares
const getFlares = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    // Default: last 7 days if no dates given
    const today = new Date().toISOString().split("T")[0];
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const data = await fetchSolarFlares(
      startDate || lastWeek,
      endDate || today
    );

    // Save to DB (avoid duplicates)
    for (let f of data) {
      await Flare.upsert({
        id: f.flrID,
        classType: f.classType,
        beginTime: f.beginTime,
        peakTime: f.peakTime,
        endTime: f.endTime,
        sourceLocation: f.sourceLocation,
      });
    }

    // Fetch from DB to return
    const flares = await Flare.findAll();

    res.json({
      count: flares.length,
      flares,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getFlares };
