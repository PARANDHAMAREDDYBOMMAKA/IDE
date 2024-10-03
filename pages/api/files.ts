// pages/api/files.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma'; // Make sure the import path is correct

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const files = await prisma.file.findMany(); // Adjust this according to your Prisma schema
      res.status(200).json(files);
    } catch (error) {
      console.error('Error fetching files:', error);
      res.status(500).json({ error: 'Error fetching files' });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, type } = req.body; // Adjust according to your file schema
      const newFile = await prisma.file.create({
        data: {
          name,
          type,
        },
      });
      res.status(201).json(newFile); // Respond with the created file
    } catch (error) {
      console.error('Error creating file:', error);
      res.status(500).json({ error: 'Error creating file' });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query; // Assuming you pass the id as a query parameter

    if (!id) {
      return res.status(400).json({ error: 'File ID is required' });
    }

    try {
      await prisma.file.delete({
        where: { id: String(id) }, // Ensure the id is a string
      });
      res.status(204).end(); // No Content
    } catch (error) {
      console.error('Error deleting file:', error);
      res.status(500).json({ error: 'Error deleting file' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
