/* eslint-disable @typescript-eslint/no-explicit-any */
// app/page.tsx or pages/index.tsx

"use client";

import React, { useEffect, useState } from "react";
import FileExplorer from "../components/FileExplorer";
import CodeEditor from "../components/Editor";
import { FileItem } from "../app/types";

const HomePage: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch all root files and folders
  const fetchFiles = async () => {
    try {
      const res = await fetch("/api/files");
      if (!res.ok) throw new Error("Failed to fetch files");
      const data: FileItem[] = await res.json();
      setFiles(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // Handle file selection
  const handleSelectFile = async (file: FileItem) => {
    if (file.type === "file") {
      try {
        const res = await fetch(`/api/files/${file.id}`);
        if (!res.ok) throw new Error("Failed to fetch file content");
        const data: FileItem = await res.json();
        setSelectedFile(data);
      } catch (err: any) {
        setError(err.message);
      }
    } else {
      setSelectedFile(null); // Optionally handle folder selection
    }
  };

  // Handle file/folder creation
  const handleCreateItem = async (name: string, type: "file" | "folder") => {
    try {
      const res = await fetch("/api/files", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, type, parentId: null }), // Assuming root
      });
      if (!res.ok) throw new Error("Failed to create item");
      const newItem: FileItem = await res.json();
      setFiles([...files, newItem]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Handle file/folder deletion
  const handleDeleteItem = async (id: number) => {
    try {
      const res = await fetch(`/api/files/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete item");
      setFiles(files.filter((file) => file.id !== id));
      if (selectedFile && selectedFile.id === id) {
        setSelectedFile(null);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Handle file content update
  const handleUpdateFile = async (id: number, content: string) => {
    try {
      const res = await fetch(`/api/files/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error("Failed to update file");
      const updatedFile: FileItem = await res.json();
      setSelectedFile(updatedFile);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex h-screen">
      <FileExplorer
        files={files}
        onSelectFile={handleSelectFile}
        onCreateItem={handleCreateItem}
        onDeleteItem={handleDeleteItem}
      />
      <div className="flex-1">
        {selectedFile ? (
          <CodeEditor file={selectedFile} onUpdateFile={handleUpdateFile} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select a file to edit</p>
          </div>
        )}
      </div>
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default HomePage;
