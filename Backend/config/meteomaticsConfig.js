const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  username: process.env.METEOMATICS_USERNAME,
  password: process.env.METEOMATICS_PASSWORD,
};
