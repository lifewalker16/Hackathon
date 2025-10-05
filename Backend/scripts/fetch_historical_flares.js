// const fetchSolarFlares = require("../config/nasaApi");
// const Flare = require("../models/flareModel");

// // Helper to fetch historical data in chunks
// async function fetchHistoricalFlares(startDate, endDate) {
//   let currentStart = new Date(startDate);
//   const finalEnd = new Date(endDate);

//   while (currentStart <= finalEnd) {
//     // NASA API allows max 30 days per request (just to be safe, use 7 days)
//     let chunkEnd = new Date(currentStart);
//     chunkEnd.setDate(chunkEnd.getDate() + 6); 
//     if (chunkEnd > finalEnd) chunkEnd.setTime(finalEnd.getTime());

//     const from = currentStart.toISOString().split("T")[0];
//     const to = chunkEnd.toISOString().split("T")[0];

//     console.log(`Fetching flares from ${from} to ${to}...`);
//     try {
//       const data = await fetchSolarFlares(from, to);
//       for (const f of data) {
//         await Flare.upsert({
//           id: f.flrID,
//           classType: f.classType,
//           beginTime: f.beginTime,
//           peakTime: f.peakTime,
//           endTime: f.endTime,
//           sourceLocation: f.sourceLocation,
//         });
//       }
//       console.log(`✅ Stored ${data.length} flares for ${from} → ${to}`);
//     } catch (err) {
//       console.error(`❌ Failed for ${from} → ${to}:`, err.message);
//     }

//     // Move to next chunk
//     currentStart.setDate(currentStart.getDate() + 7);
//   }

//   console.log("✅ Historical fetch complete!");
// }

// // Run script directly
// const args = process.argv.slice(2); // node fetch_historical_flares.js 2010-01-01 2023-01-01
// if (args.length !== 2) {
//   console.log("Usage: node fetch_historical_flares.js <startDate> <endDate>");
//   process.exit(1);
// }

// fetchHistoricalFlares(args[0], args[1])
//   .then(() => process.exit(0))
//   .catch(err => console.error(err));

  






require("dotenv").config();
const fetchSolarFlares = require("../config/nasaApi");
const Flare = require("../models/flareModel");
const connectDB = require("../config/db");

async function fetchHistoricalFlares(startDate, endDate) {
  await connectDB();
  let currentStart = new Date(startDate);
  const finalEnd = new Date(endDate);

  while (currentStart <= finalEnd) {
    let chunkEnd = new Date(currentStart);
    chunkEnd.setDate(chunkEnd.getDate() + 6);
    if (chunkEnd > finalEnd) chunkEnd = finalEnd;

    const from = currentStart.toISOString().split("T")[0];
    const to = chunkEnd.toISOString().split("T")[0];

    console.log(`Fetching flares from ${from} to ${to}...`);
    try {
      const data = await fetchSolarFlares(from, to);
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
      console.log(`✅ Stored ${data.length} flares for ${from} → ${to}`);
    } catch (err) {
      console.error(`❌ Failed for ${from} → ${to}:`, err.message);
    }

    currentStart.setDate(currentStart.getDate() + 7);
  }

  console.log("✅ Historical fetch complete!");
  process.exit(0);
}

const args = process.argv.slice(2);
if (args.length !== 2) {
  console.log("Usage: node scripts/fetch_historical_flares.js <startDate> <endDate>");
  process.exit(1);
}

fetchHistoricalFlares(args[0], args[1]);
