// components/FileExplorer.tsx

"use client";

import React, { useState } from "react";
import { FileItem } from "../app/types";

interface FileExplorerProps {
  files: FileItem[];
  onSelectFile: (file: FileItem) => void;
  onCreateItem: (name: string, type: "file" | "folder") => void;
  onDeleteItem: (id: number) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  onSelectFile,
  onCreateItem,
  onDeleteItem,
}) => {
  const [newFileName, setNewFileName] = useState("");
  const [isCreatingFile, setIsCreatingFile] = useState(false);

  const handleCreateItem = (type: "file" | "folder") => {
    if (newFileName) {
      onCreateItem(newFileName, type);
      setNewFileName("");
      setIsCreatingFile(false);
    }
  };

  const handleDeleteItem = (id: number) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      onDeleteItem(id);
    }
  };

  const renderFileTree = (file: FileItem) => {
    return (
      <li
        key={file.id}
        className="hover:bg-gray-200 cursor-pointer p-1 flex justify-between items-center"
      >
        <span onClick={() => file.type === "file" && onSelectFile(file)}>
          {file.type === "folder" ? "📁 " : "📄 "} {file.name}
        </span>
        <span
          className="text-red-500 cursor-pointer"
          onClick={() => handleDeleteItem(file.id)}
        >
          ❌
        </span>
      </li>
    );
  };

  return (
    <div className="w-1/3 border-r p-4">
      <h2 className="text-lg font-bold mb-4">File Explorer</h2>
      {isCreatingFile ? (
        <div>
          <input
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            placeholder="New file name"
            className="border p-1 rounded"
          />
          <button
            onClick={() => handleCreateItem("file")}
            className="bg-blue-500 text-white px-2 rounded ml-2"
          >
            Create File
          </button>
          <button
            onClick={() => handleCreateItem("folder")}
            className="bg-green-500 text-white px-2 rounded ml-2"
          >
            Create Folder
          </button>
          <button
            onClick={() => setIsCreatingFile(false)}
            className="bg-gray-500 text-white px-2 rounded ml-2"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsCreatingFile(true)}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
        >
          New File/Folder
        </button>
      )}
      <ul className="mt-4">{files.map(renderFileTree)}</ul>
    </div>
  );
};

export default FileExplorer;
