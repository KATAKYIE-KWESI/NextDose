import { db } from '../_lib/db.js';
import { getUserIdFromRequest, setCors } from '../_lib/auth.js';

export default function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const userId = getUserIdFromRequest(req);
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  const user = db.getUserById(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      birthYear: user.birthYear,
      lastPap: user.lastPap,
      lastBreastExam: user.lastBreastExam,
    },
  });
}
