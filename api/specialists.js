import { db } from './_lib/db.js';
import { getUserIdFromRequest, setCors } from './_lib/auth.js';

export default function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const userId = getUserIdFromRequest(req);
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  res.status(200).json({ specialists: db.listSpecialists() });
}
