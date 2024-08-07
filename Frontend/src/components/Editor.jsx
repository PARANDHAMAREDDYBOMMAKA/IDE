import React from "react";
import MonacoEditor from "@monaco-editor/react";
import { Box } from "@chakra-ui/react";

const Editor = ({ language, code, onChange }) => {
  return (
    <Box>
      <MonacoEditor
        height="400px"
        language={language}
        value={code}
        onChange={(value) => onChange(value)}
        theme="vs-dark"
      />
    </Box>
  );
};

export default Editor;
