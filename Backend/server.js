const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { exec } = require("child_process");

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

  let command;
  switch (language) {
    case "python":
      command = `python3 -c "${code.replace(/"/g, '\\"')}"`;
      break;
    case "javascript":
    case "nodejs":
      command = `node -e "${code.replace(/"/g, '\\"')}"`;
      break;
    case "java":
      command = `echo '${code}' > Main.java && javac Main.java && java Main`;
      break;
    case "cpp":
      command = `echo '${code}' > main.cpp && g++ main.cpp -o main && ./main`;
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
      command = `echo '${code}' > main.c && gcc main.c -o main && ./main`;
      break;
    case "csharp":
      command = `echo '${code}' > Program.cs && mcs Program.cs && mono Program.exe`;
      break;
    case "r":
      command = `Rscript -e "${code.replace(/"/g, '\\"')}"`;
      break;
    case "swift":
      command = `swift -e "${code.replace(/"/g, '\\"')}"`;
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
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
