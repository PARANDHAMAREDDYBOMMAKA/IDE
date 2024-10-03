/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useCallback } from "react";
import FileExplorer from "../components/FileExplorer";
import { FileItem } from "./types";
import Terminal from "@/components/Terminal";
import Editor from "@monaco-editor/react"; // Import Monaco Editor

// Mapping of file extensions to language identifiers for Monaco
const languageMap: { [key: string]: string } = {
  js: "javascript",
  py: "python",
  java: "java",
  rb: "ruby",
  cpp: "cpp",
  go: "go",
  html: "html",
  css: "css",
  ts: "typescript", // TypeScript support
  // Add more languages as needed
};

const HomePage: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [fileContents, setFileContents] = useState<{ [key: number]: string }>(
    {}
  );
  const [fileContent, setFileContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Function to fetch files from the server
  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/files");
      if (!res.ok) throw new Error("Failed to fetch files");
      const data: FileItem[] = await res.json();
      setFiles(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect to fetch files on component mount
  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // Function to handle file selection
  const handleSelectFile = async (file: FileItem) => {
    if (file.type === "file") {
      if (fileContents[file.id]) {
        setSelectedFile(file);
        setFileContent(fileContents[file.id]);
      } else {
        try {
          const res = await fetch(`/api/files/${file.id}`);
          if (!res.ok) throw new Error("Failed to fetch file content");
          const data: FileItem = await res.json();
          setSelectedFile(data);
          setFileContents((prev) => ({
            ...prev,
            [data.id]: data.content || "",
          }));
          setFileContent(data.content || "");
        } catch (err: any) {
          setError(err.message);
        }
      }
    } else {
      setSelectedFile(null);
    }
  };

  // Function to create a new file or folder
  const handleCreateItem = async (name: string, type: "file" | "folder") => {
    try {
      const res = await fetch("/api/files", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, type }),
      });
      if (!res.ok) throw new Error("Failed to create item");
      const newItem: FileItem = await res.json();
      setFiles((prevFiles) => [...prevFiles, newItem]);

      if (type === "file") {
        setSelectedFile(newItem);
        setFileContents((prev) => ({
          ...prev,
          [newItem.id]: newItem.content || "",
        }));
        setFileContent(newItem.content || "");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Function to delete a file or folder
  const handleDeleteItem = async (id: number) => {
    try {
      const res = await fetch(`/api/files/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete item");
      setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
      if (selectedFile && selectedFile.id === id) {
        setSelectedFile(null);
        setFileContent("");
        setFileContents((prev) => {
          const newContents = { ...prev };
          delete newContents[id];
          return newContents;
        });
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Function to update the file content
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
      setFileContents((prev) => ({
        ...prev,
        [updatedFile.id]: updatedFile.content || "",
      }));
      setFileContent(updatedFile.content || "");
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Function to dismiss error messages
  const handleDismissError = () => setError(null);

  // Determine the language based on the file name or extension
  const getLanguage = (fileName: string) => {
    const extension = fileName.split(".").pop() || "";
    return languageMap[extension] || "plaintext"; // Default to plaintext if no match found
  };

  return (
    <div className="flex h-screen">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Loading files...</p>
        </div>
      ) : (
        <>
          <FileExplorer
            files={files}
            onSelectFile={handleSelectFile}
            onCreateItem={handleCreateItem}
            onDeleteItem={handleDeleteItem}
          />
          <div className="flex-1 flex flex-col">
            {selectedFile ? (
              <>
                <Editor
                  height="100%"
                  language={getLanguage(selectedFile.name)} // Use the dynamic language based on file name
                  value={fileContent}
                  onChange={(value) => {
                    setFileContent(value || "");
                    setFileContents((prev) => ({
                      ...prev,
                      [selectedFile.id]: value || "",
                    }));
                  }}
                  options={{
                    selectOnLineNumbers: true,
                    automaticLayout: true,
                  }}
                />
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded mt-2"
                  onClick={() => handleUpdateFile(selectedFile.id, fileContent)}
                >
                  Save
                </button>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Select a file to edit</p>
              </div>
            )}
          </div>
          {error && (
            <div
              className="fixed bottom-4 right-4 bg-red-500 text-white p-2 rounded cursor-pointer"
              onClick={handleDismissError}
            >
              {error}
            </div>
          )}
          <Terminal />
        </>
      )}
    </div>
  );
};

export default HomePage;
