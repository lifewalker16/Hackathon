const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const sequelize = require("./config/db");
const flareRoutes = require("./routes/flareRoutes");
const errorHandler = require("./middleware/errorHandler");
const bodyParser = require("body-parser");
const cron = require("node-cron"); // ✅ import cron
const summaryRoute = require("./routes/summaryRoute"); // <-- NEW
const fetchAndStoreFlares = require("./controllers/fetchAndStoreFlares"); // ✅ new helper
const predictRoute = require("./routes/predictRoute");
const PORT = process.env.PORT || 5000;

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/flares", flareRoutes);

app.use("/api/predict", predictRoute);

app.use("/api/summary", summaryRoute); // <-- NEW


// Error middleware
app.use(errorHandler);
// ------------------
// Cron job: daily fetch
// ------------------
cron.schedule("0 0 * * *", async () => { // runs every day at midnight
  console.log("⏰ Running daily solar flare fetch...");
  try {
    await fetchAndStoreFlares();
  } catch (err) {
    console.error("❌ Daily fetch failed:", err.message);
  }
});

// ✅ Sync DB, then start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));