import { db } from '../_lib/db.js';
import { hashPassword, signToken, setCors } from '../_lib/auth.js';

export default function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password, name, birthYear } = req.body || {};
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'email, password, and name are required' });
  }
  if (db.getUserByEmail(email)) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const user = db.createUser({
    email,
    passwordHash: hashPassword(password),
    name,
    birthYear: birthYear ? Number(birthYear) : null,
  });

  const token = signToken(user);
  res.status(201).json({
    token,
    user: { id: user.id, email: user.email, name: user.name, birthYear: user.birthYear },
  });
}
