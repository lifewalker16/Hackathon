// const { DataTypes } = require("sequelize");
// const sequelize = require("../config/db");

// const Flare = sequelize.define("Flare", {
//   id: {
//     type: DataTypes.STRING,
//     primaryKey: true,
//   },
//   classType: {
//     type: DataTypes.STRING,
//   },
//   beginTime: {
//     type: DataTypes.DATE,
//   },
//   peakTime: {
//     type: DataTypes.DATE,
//   },
//   endTime: {
//     type: DataTypes.DATE,
//   },
//   sourceLocation: {
//     type: DataTypes.STRING,
//   },
// });

// module.exports = Flare;


const mongoose = require("mongoose");

const flareSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  classType: String,
  beginTime: Date,
  peakTime: Date,
  endTime: Date,
  sourceLocation: String,
});

flareSchema.index({ beginTime: 1 });

module.exports = mongoose.model("Flare", flareSchema);
