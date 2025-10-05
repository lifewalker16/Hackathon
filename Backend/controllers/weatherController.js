const axios = require("axios");
const meteomaticsConfig = require("../config/meteomaticsConfig");

const getWeatherData = async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: "Latitude and longitude are required" });
    }

    const now = new Date().toISOString().split(".")[0] + "Z";
    const url = `https://api.meteomatics.com/${now}/t_2m:C,wind_speed_10m:ms,precip_1h:mm/${lat},${lon}/json`;

    const response = await axios.get(url, {
      auth: {
        username: meteomaticsConfig.username,
        password: meteomaticsConfig.password,
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    next(error);
  }
};

module.exports = { getWeatherData };
