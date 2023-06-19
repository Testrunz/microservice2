const Runz = require("../models/Runz");
const path = require("path");
const { spawn, ChildProcess } = require("child_process");
const SCRIPT_PATH = path.join(__dirname, "../", "scripts/script.py");

/**
 * @param param {String}
 * @return {ChildProcess}
 */
function runScript(param, title) {
 
  return spawn("python", [SCRIPT_PATH, title, param]);
}

const playPython = async (req, res) => {
  try {
    const runz = await Runz.findById(req.params.id).lean();
    const scriptProcess = runScript(runz.datas, req.params.title);
    scriptProcess.stdout.pipe(res);
    scriptProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });
    scriptProcess.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error. Please try again" });
  }
};

module.exports = { playPython };
