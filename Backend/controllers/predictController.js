// // const { PythonShell } = require("python-shell");
// // const path = require("path");

// // // Controller to handle prediction
// // const predictFlare = (req, res) => {
// //   const features = req.body;

// //   if (!features || Object.keys(features).length === 0) {
// //     return res.status(400).json({ error: "No features provided" });
// //   }

// //   const options = {
// //     mode: "text",
// //     pythonPath: "C:/Python313/python.exe", // ✅ Use this exact path (normal env Python)
// //     pythonOptions: ["-u"], // unbuffered output
// //     args: [JSON.stringify(features)], // pass features as JSON string
// //   };

// //   // Absolute path to your Python prediction script
// //   const scriptPath = path.join(__dirname, "../scripts/python_ml/predict_flare.py");

// //   PythonShell.run(scriptPath, options, (err, results) => {
// //     if (err) {
// //       return res.status(500).json({ error: err.message });
// //     }

// //     try {
// //       const prediction = JSON.parse(results[0]);
// //       res.json(prediction);
// //     } catch (e) {
// //       res.status(500).json({ error: "Failed to parse Python output" });
// //     }
// //   });
// // };

// // module.exports = { predictFlare };


// const { spawn } = require("node:child_process");
// const path = require("path");

// const predictFlare = (req, res) => {
//   const features = req.body;
//   if (!features || Object.keys(features).length === 0) {
//     return res.status(400).json({ error: "No features provided" });
//   }

//   const pythonPath = process.env.PYTHON_PATH || "python";
//   const scriptPath = path.join(__dirname, "../scripts/python_ml/predict_flare.py");

//   const py = spawn(pythonPath, [scriptPath], { stdio: ["pipe", "pipe", "pipe"] });

//   let out = "";
//   let err = "";

//   py.stdout.on("data", d => { out += d.toString(); });
//   py.stderr.on("data", d => { err += d.toString(); });

//   py.on("close", code => {
//     if (code !== 0) return res.status(500).json({ error: err || `Python exited with code ${code}` });

//     const last = out.trim().split(/\r?\n/).filter(Boolean).pop() || "";
//     try {
//       return res.json(JSON.parse(last));
//     } catch {
//       return res.status(500).json({ error: "Failed to parse Python output", raw: last, stderr: err });
//     }
//   });

//   py.stdin.write(JSON.stringify(features));
//   py.stdin.end();
// };

// module.exports = { predictFlare };

const { spawn } = require("child_process");

// Controller function to handle predictions
const predictFlare = (req, res) => {
  try {
    const { duration, hour, day_of_year } = req.body;

    if (duration === undefined || hour === undefined || day_of_year === undefined) {
      return res.status(400).json({ error: "Provide duration, hour, and day_of_year" });
    }

    // Path to your virtual environment Python and script
    const pythonPath = "venv/Scripts/python.exe"; // Windows
    const scriptPath = "scripts/python_ml/predict_flare.py";

    const args = [scriptPath, duration, hour, day_of_year];

    const pyProcess = spawn(pythonPath, args);

    let dataString = "";
    let errorString = "";

    pyProcess.stdout.on("data", (data) => {
      dataString += data.toString();
    });

    pyProcess.stderr.on("data", (data) => {
      errorString += data.toString();
    });

    pyProcess.on("close", (code) => {
      if (code !== 0) {
        return res.status(500).json({ error: errorString || "Python script error" });
      }

      try {
        const result = JSON.parse(dataString);
        res.json(result);
      } catch (err) {
        res.status(500).json({ error: "Failed to parse Python output" });
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { predictFlare };
