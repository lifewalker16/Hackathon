const { spawn } = require("child_process");
const path = require("path");

// Adjust this to the Python installed in your normal environment
const PYTHON_PATH = "C:/Python313/python.exe";

// Python summarizer script path
const SCRIPT_PATH = path.join(__dirname, "../scripts/python_ml/summarize_flares.py");

const predictSummary = (req, res) => {
  // Optional filters from frontend
  const { startDate, endDate } = req.body;

  // Convert filters to JSON string for Python
  const args = [JSON.stringify({ startDate, endDate })];

  // Spawn Python process
  const pythonProcess = spawn(PYTHON_PATH, [SCRIPT_PATH, ...args]);

  let result = "";
  let error = "";

  pythonProcess.stdout.on("data", (data) => {
    result += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    error += data.toString();
  });

  pythonProcess.on("close", (code) => {
    if (code !== 0 || error) {
      return res.status(500).json({ error: error || "Python script failed" });
    }

    try {
      const output = JSON.parse(result);
      res.json(output);
    } catch (err) {
      res.status(500).json({ error: "Invalid output from Python script" });
    }
  });
};

module.exports = { predictSummary };
