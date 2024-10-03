/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { PrismaClient, File } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const files: File[] = await prisma.file.findMany();
    return NextResponse.json(files);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, type, parentId } = await request.json();

    if (!name || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (type !== "file" && type !== "folder") {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const data: any = {
      name,
      type,
      parentId: parentId ? parseInt(parentId) : null,
    };

    if (type === "file") {
      data.language = getLanguageFromFileExtension(name);
      data.content = "";
    }

    const newFile = await prisma.file.create({
      data,
    });

    return NextResponse.json(newFile);
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Failed to create file/folder" }, { status: 500 });
  }
}

function getLanguageFromFileExtension(fileName: string): string | undefined {
  const extension = fileName.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "js":
      return "javascript";
    case "ts":
      return "typescript";
    case "py":
      return "python";
    case "json":
      return "json";
    default:
      return "plaintext";
  }
}
