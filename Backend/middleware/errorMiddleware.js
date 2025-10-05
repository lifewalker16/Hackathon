const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message || err);
  res.status(500).json({
    success: false,
    message: err.message || "Server Error",
  });
};

module.exports = { errorHandler };
