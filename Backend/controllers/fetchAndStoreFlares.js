const fetchSolarFlares = require("../config/nasaApi");
const Flare = require("../models/flareModel");

async function fetchAndStoreFlares() {
  try {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const data = await fetchSolarFlares(yesterday, today);

    for (const f of data) {
      await Flare.updateOne(
        { id: f.flrID },
        {
          id: f.flrID,
          classType: f.classType,
          beginTime: f.beginTime,
          peakTime: f.peakTime,
          endTime: f.endTime,
          sourceLocation: f.sourceLocation,
        },
        { upsert: true }
      );
    }

    console.log(`✅ Daily fetch complete: ${data.length} flares stored`);
  } catch (err) {
    console.error("❌ Daily fetch failed:", err.message);
  }
}

module.exports = fetchAndStoreFlares;
