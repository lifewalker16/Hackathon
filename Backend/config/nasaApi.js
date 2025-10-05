const axios = require("axios");

const NASA_API = "https://api.nasa.gov/DONKI/FLR";

async function fetchSolarFlares(startDate, endDate) {
  try {
    const res = await axios.get(NASA_API, {
      params: {
        startDate,
        endDate,
        api_key: process.env.NASA_API_KEY || "DEMO_KEY",
      },
    });
    return res.data;
  } catch (err) {
    throw new Error("Failed to fetch data from NASA API");
  }
}

module.exports = fetchSolarFlares;
