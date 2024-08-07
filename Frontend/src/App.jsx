import React, { useState } from "react";
import Editor from "./components/Editor";
import TerminalComponent from "./components/Terminal";
import DebuggingConsole from "./components/DebuggingConsole";
import axios from "axios";
import { Box, Select, Button } from "@chakra-ui/react";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [code, setCode] = useState("// Your code here");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [error, setError] = useState("");

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleRun = async () => {
    try {
      const response = await axios.post("https://ide-o0uf.onrender.com/run", {
        code,
        language,
      });

      if (response.data.error) {
        setError(response.data.error);
        setOutput("");
      } else {
        setError("");
        setOutput(response.data.output);
      }
    } catch (err) {
      setError(`Request error: ${err.message}`);
      setOutput("");
    }
  };

  const boilerplates = {
    javascript: '// Your code here\nconsole.log("hello world");',
    python: '# Your code here\nprint("hello world")',
    java: `import java.io.*;\nimport java.util.*;
    public class Main {
    public static void main(String args[]) {
        System.out.println("Hello, World!");
    }
}`,
    cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!";
    return 0;
}`,
    php: `<?php
echo "Hello, World!";
?>`,
    typescript: '// Your code here\nconsole.log("hello world");',
    ruby: '# Your code here\nputs "hello world"',
    nodejs: '// Your code here\nconsole.log("hello world");',
    c: `#include <stdio.h>

int main() {
    printf("Hello, World!");
    return 0;
}`,
    csharp: `using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
    }
}`,
    r: `# Your code here
print("Hello, World!")`,
    swift: `import Foundation

print("Hello, World!")`,
  };

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    setCode(boilerplates[selectedLanguage]);
  };

  return (
    <Box p={4}>
      <Select value={language} onChange={handleLanguageChange} mb={4}>
        {Object.keys(boilerplates).map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </Select>
      <Editor language={language} code={code} onChange={handleEditorChange} />
      <Button onClick={handleRun} mt={4}>
        Run Code
      </Button>
      {error && (
        <Box mt={4} color="red.500">
          <strong>Error:</strong>
          <pre>{error}</pre>
        </Box>
      )}
      {output && (
        <Box mt={4}>
          <strong>Output:</strong>
          <pre>{output}</pre>
        </Box>
      )}
      <TerminalComponent />
      <DebuggingConsole messages={messages} />
    </Box>
  );
};

export default App;
