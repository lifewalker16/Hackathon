// const fetchSolarFlares = require("../config/nasaApi");
// const Flare = require("../models/flareModel");
// const { Op } = require("sequelize");

// // GET /api/flares
// const getFlares = async (req, res, next) => {
//   try {
//     const { startDate, endDate } = req.query;

//     const today = new Date().toISOString().split("T")[0];
//     const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
//       .toISOString()
//       .split("T")[0];

//     const from = startDate || lastWeek;
//     const to = endDate || today;

//     // ✅ Step 1: Check DB first
//     let flares = await Flare.findAll({
//       where: { beginTime: { [Op.between]: [from, to] } },
//     });

//     // ✅ Step 2: If no data, fetch from NASA & save
//     if (flares.length === 0) {
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

//       // Fetch again from DB
//       flares = await Flare.findAll({
//         where: { beginTime: { [Op.between]: [from, to] } },
//       });
//     }

//     // ✅ Step 3: Return response
//     res.json({
//       count: flares.length,
//       flares,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// module.exports = { getFlares };


const fetchSolarFlares = require("../config/nasaApi");
const Flare = require("../models/flareModel");

// GET /api/flares
const getFlares = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const today = new Date().toISOString().split("T")[0];
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const from = startDate || lastWeek;
    const to = endDate || today;

    // Step 1: Check DB
    let flares = await Flare.find({
      beginTime: { $gte: from, $lte: to },
    });

    // Step 2: Fetch from NASA if DB is empty
    if (flares.length === 0) {
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

      flares = await Flare.find({
        beginTime: { $gte: from, $lte: to },
      });
    }

    res.json({
      count: flares.length,
      flares,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getFlares };
