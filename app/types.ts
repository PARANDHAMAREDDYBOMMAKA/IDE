// types/index.ts

export interface FileItem {
    id: number;
    name: string;
    type: "file" | "folder";
    content?: string;  // Optional property for file content
    language?: string; // Optional property for file language
    children?: FileItem[]; // Optional property for folder children
  }
  