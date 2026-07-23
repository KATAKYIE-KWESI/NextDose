import { db } from '../_lib/db.js';
import { getUserIdFromRequest, setCors } from '../_lib/auth.js';

export default function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const userId = getUserIdFromRequest(req);
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  const { id } = req.query;

  if (req.method === 'DELETE') {
    const ok = db.deleteCycleLog(userId, id);
    if (!ok) return res.status(404).json({ error: 'Log not found' });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
