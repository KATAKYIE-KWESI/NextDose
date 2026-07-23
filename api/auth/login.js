import { db } from '../_lib/db.js';
import { verifyPassword, signToken, setCors } from '../_lib/auth.js';

export default function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password } = req.body || {};
  const user = db.getUserByEmail(email || '');
  if (!user || !verifyPassword(password || '', user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = signToken(user);
  res.status(200).json({
    token,
    user: { id: user.id, email: user.email, name: user.name, birthYear: user.birthYear },
  });
}
