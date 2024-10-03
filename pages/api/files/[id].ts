// pages/api/files/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma'; // Make sure the import path is correct

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;

  if (method === 'DELETE') {
    try {
      const deletedFile = await prisma.file.delete({
        where: { id: Number(id) }, // Ensure id is a number
      });
      res.status(200).json(deletedFile);
    } catch (error) {
      console.error('Error deleting file:', error);
      res.status(500).json({ error: 'Error deleting file' });
    }
  } else if (method === 'PUT') {
    const { name, content } = req.body; // Assuming you have a name and content in the request body
    try {
      const updatedFile = await prisma.file.update({
        where: { id: Number(id) }, // Ensure id is a number
        data: { name, content },
      });
      res.status(200).json(updatedFile);
    } catch (error) {
      console.error('Error updating file:', error);
      res.status(500).json({ error: 'Error updating file' });
    }
  } else {
    res.setHeader('Allow', ['DELETE', 'PUT']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
