import React, { useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import { Box, Select } from "@chakra-ui/react";

// Define boilerplate codes for each language
const boilerplates = {
  javascript: "// Your code here\nconsole.log('Hello World');",
  python: "# Your code here\nprint('Hello World')",
  php: "<?php\n// Your code here\necho 'Hello World';\n?>",
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World");\n    }\n}',
  cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello World" << std::endl;\n    return 0;\n}',
  c: '#include <stdio.h>\n\nint main() {\n    printf("Hello World\\n");\n    return 0;\n}',
  typescript: "// Your code here\nconsole.log('Hello World');",
  ruby: "# Your code here\nputs 'Hello World'",
  csharp:
    'using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello World");\n    }\n}',
  r: "# Your code here\nprint('Hello World')",
  swift: 'import Foundation\n\nprint("Hello World")',
};

const Editor = ({ onChange }) => {
  const [code, setCode] = useState(boilerplates.javascript); // Default to JavaScript
  const [language, setLanguage] = useState("javascript");

  const handleChange = (value) => {
    setCode(value);
    onChange({ code: value, language });
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    setCode(boilerplates[newLanguage] || "// Your code here");
    onChange({
      code: boilerplates[newLanguage] || "// Your code here",
      language: newLanguage,
    });
  };

  return (
    <Box p={4}>
      <Select value={language} onChange={handleLanguageChange} mt={2}>
        {Object.keys(boilerplates).map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </Select>
      <MonacoEditor
        height="400px"
        language={language}
        value={code}
        onChange={handleChange}
        theme="vs-dark"
      />
    </Box>
  );
};

export default Editor;
