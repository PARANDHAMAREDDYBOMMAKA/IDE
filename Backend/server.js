const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 8000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.post("/run", (req, res) => {
  const { code, language } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: "Code and language are required" });
  }

  const tempDir = path.join(__dirname, "temp");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  let command;
  let filename;
  let filepath;

  switch (language) {
    case "python":
      command = `python3 -c "${code.replace(/"/g, '\\"')}"`;
      break;
    case "javascript":
    case "nodejs":
      command = `node -e "${code.replace(/"/g, '\\"')}"`;
      break;
    case "java":
      filename = "Main.java";
      filepath = path.join(tempDir, filename);
      fs.writeFileSync(filepath, code);
      command = `javac ${filepath} && java -cp ${tempDir} Main`;
      break;
    case "cpp":
      filename = "main.cpp";
      filepath = path.join(tempDir, filename);
      fs.writeFileSync(filepath, code);
      command = `g++ ${filepath} -o ${tempDir}/main && ${tempDir}/main`;
      break;
    case "php":
      command = `php -r "${code.replace(/"/g, '\\"')}"`;
      break;
    case "typescript":
      command = `ts-node -e "${code.replace(/"/g, '\\"')}"`;
      break;
    case "ruby":
      command = `ruby -e "${code.replace(/"/g, '\\"')}"`;
      break;
    case "c":
      filename = "main.c";
      filepath = path.join(tempDir, filename);
      fs.writeFileSync(filepath, code);
      command = `gcc ${filepath} -o ${tempDir}/main && ${tempDir}/main`;
      break;
    case "csharp":
      filename = "Program.cs";
      filepath = path.join(tempDir, filename);
      fs.writeFileSync(filepath, code);
      command = `mcs ${filepath} -out:${tempDir}/Program.exe && mono ${tempDir}/Program.exe`;
      break;
    case "r":
      command = `Rscript -e "${code.replace(/"/g, '\\"')}"`;
      break;
    case "swift":
      filename = "main.swift";
      filepath = path.join(tempDir, filename);
      fs.writeFileSync(filepath, code);
      command = `swift ${filepath}`;
      break;
    default:
      return res.status(400).json({ error: "Unsupported language" });
  }

  exec(command, (error, stdout, stderr) => {
    if (error) {
      res.status(400).json({ error: `Execution error: ${stderr}` });
    } else {
      res.json({ output: stdout });
    }
    // Clean up temporary files
    if (filepath) {
      fs.unlinkSync(filepath);
    }
    if (filename && language !== "java") {
      const compiledFile = path.join(tempDir, "main");
      if (fs.existsSync(compiledFile)) {
        fs.unlinkSync(compiledFile);
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
