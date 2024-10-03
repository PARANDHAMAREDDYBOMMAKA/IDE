import { NextResponse } from "next/server";
import { PrismaClient, File } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const file: File | null = await prisma.file.findUnique({
      where: { id: parseInt(id) },
    });
    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    return NextResponse.json(file);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch file" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const { name, content } = await request.json();

    const file: File | null = await prisma.file.findUnique({ where: { id: parseInt(id) } });
    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const updatedFile = await prisma.file.update({
      where: { id: parseInt(id) },
      data: {
        name: name || file.name,
        content: content !== undefined ? content : file.content,
      },
    });

    return NextResponse.json(updatedFile);
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { error: "Failed to update file" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  console.log("Attempting to delete file with ID:", id);

  const fileId = parseInt(id);
  if (isNaN(fileId)) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }

  try {
    const file: File | null = await prisma.file.findUnique({ where: { id: fileId } });
    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    if (file.type === "folder") {
      await deleteFolderRecursively(fileId);
    } else {
      await prisma.file.delete({ where: { id: fileId } });
    }

    return NextResponse.json({ message: "File/Folder deleted successfully" });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { error: "Failed to delete file/folder" },
      { status: 500 }
    );
  }
}

async function deleteFolderRecursively(parentId: number) {
  const children = await prisma.file.findMany({ where: { parentId } });
  for (const child of children) {
    if (child.type === "folder") {
      await deleteFolderRecursively(child.id);
    } else {
      await prisma.file.delete({ where: { id: child.id } });
    }
  }
  await prisma.file.delete({ where: { id: parentId } });
}
