// pages/api/terminal.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { command } = req.body;

    // Simulate command execution (replace with actual command execution logic)
    const output = `Executed: ${command}`;
    
    res.status(200).json({ output });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
