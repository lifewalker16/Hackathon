// const { Sequelize } = require("sequelize");
// require("dotenv").config(); 

// const sequelize = new Sequelize(
//   process.env.DB_NAME || "nasa_data",
//   process.env.DB_USER || "root",
//   process.env.DB_PASSWORD || "",
//   {
//     host: process.env.DB_HOST || "localhost",
//     dialect: "mysql",
//     logging: false,
//   }
// );

// module.exports = sequelize;



const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("✅ MongoDB Atlas connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
