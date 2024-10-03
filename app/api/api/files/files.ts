/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/files/[id]/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const { name, content } = await request.json();

    const file = await prisma.file.findUnique({ where: { id: parseInt(id) } });
    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
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
    return NextResponse.json({ error: 'Failed to update file' }, { status: 500 });
  }
}
