// components/Editor.tsx

"use client";

import React from "react";
import dynamic from "next/dynamic";
import { FileItem } from "../app/types"; // Make sure to import the FileItem type

interface EditorProps {
  file: FileItem | null; // file can be null if no file is selected
  onUpdateFile: (id: number, content: string) => void;
}

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

const CodeEditor: React.FC<EditorProps> = ({ file, onUpdateFile }) => {
  // Handle the case where no file is selected
  if (!file) {
    return <div>Please select a file to edit.</div>;
  }

  const handleEditorChange = (value: string | undefined) => {
    onUpdateFile(file.id, value || "");
  };

  return (
    <div className="flex-1 p-4 overflow-auto">
      <h3 className="font-bold mb-2">{file.name}</h3>
      <MonacoEditor
        height="80vh"
        language={file.language || "plaintext"} // Use 'plaintext' if no language specified
        theme="vs-dark" // You can change the theme as needed
        value={file.content || ""} // Use empty string if no content
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
