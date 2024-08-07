const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const port = 8000;

// JDoodle API credentials
const JDoodleClientID = "cda27eea8cc9b2e64958b0422244e4f0";
const JDoodleClientSecret =
  "9b5fa8febd628a4440711e7a7f6d638c0f50a591c3e7f607a47055b4b39834d3";

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Endpoint to run code
app.post("/run", async (req, res) => {
  const { code, language } = req.body;
  console.log(`Request received: ${JSON.stringify(req.body)}`);

  if (!code || !language) {
    return res.status(400).json({ error: "Code and language are required" });
  }

  // Language mappings for JDoodle
  const languageMappings = {
    javascript: "nodejs",
    python: "python3",
    php: "php",
    java: "java",
    cpp: "cpp",
    c: "c",
    typescript: "typescript",
    ruby: "ruby",
    csharp: "csharp",
    r: "r",
    swift: "swift",
  };

  const languageID = languageMappings[language];
  if (!languageID) {
    return res.status(400).json({ error: "Unsupported language" });
  }

  try {
    const response = await axios.post("https://api.jdoodle.com/v1/execute", {
      script: code,
      language: languageID,
      versionIndex: "0",
      clientId: JDoodleClientID,
      clientSecret: JDoodleClientSecret,
    });

    const { output, error } = response.data;

    if (error) {
      console.error(`Execution error: ${error}`);
      return res.status(400).json({ error: `Execution error: ${error}` });
    }

    res.json({ output });
  } catch (error) {
    console.error(`Request error: ${error.message}`);
    res.status(400).json({ error: `Request error: ${error.message}` });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
