import { db } from '../_lib/db.js';
import { getUserIdFromRequest, setCors } from '../_lib/auth.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) return res.status(401).json({ error: 'Not authenticated' });

    if (req.method === 'GET') {
      const logs = await db.listCycleLogs(userId);
      return res.status(200).json({
        logs: Array.isArray(logs) ? logs : []
      });
    }

    if (req.method === 'POST') {
      const { date, type, symptoms, flow, notes } = req.body || {};
      if (!date || !type) {
        return res.status(400).json({ error: 'date and type are required' });
      }

      const log = await db.addCycleLog(userId, { date, type, symptoms, flow, notes });
      return res.status(201).json({ log });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in /api/tracker:', error);
    return res.status(500).json({ error: 'Failed to process request', logs: [] });
  }
}