import { db } from './_lib/db.js';
import { getUserIdFromRequest, setCors } from './_lib/auth.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) return res.status(401).json({ error: 'Not authenticated' });

    const specialists = await db.listSpecialists();

    // Returns array directly so rawSpecialists is an Array, not an Object
    return res.status(200).json(Array.isArray(specialists) ? specialists : []);
  } catch (error) {
    console.error('Error fetching specialists:', error);
    return res.status(500).json([]);
  }
}