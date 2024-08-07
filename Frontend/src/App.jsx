import React, { useState } from "react";
import Editor from "./components/Editor";
import TerminalComponent from "./components/Terminal";
import DebuggingConsole from "./components/DebuggingConsole";
import axios from "axios";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("javascript");

  const handleEditorChange = ({ code, language }) => {
    setCode(code);
    setLanguage(language);
  };

  const handleRun = async () => {
    try {
      const response = await fetch("http://localhost:8000/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, language }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      if (result.error) {
        setError(result.error);
        setOutput("");
      } else {
        setError("");
        setOutput(result.output);
      }
    } catch (err) {
      setError(`Request error: ${err.message}`);
      setOutput("");
    }
  };

  return (
    <div>
      <button onClick={handleRun}>Run Code</button>
      <Editor onChange={handleEditorChange} />
      <TerminalComponent />
      <DebuggingConsole messages={[output, error]} />
    </div>
  );
};

export default App;
