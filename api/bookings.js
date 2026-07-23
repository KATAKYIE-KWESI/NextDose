import { db } from './_lib/db.js';
import { getUserIdFromRequest, setCors } from './_lib/auth.js';

export default function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const userId = getUserIdFromRequest(req);
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  if (req.method === 'GET') {
    return res.status(200).json({ bookings: db.listBookingsForUser(userId) });
  }

  if (req.method === 'POST') {
    const { specialistId, preferredTimes, reason, contact } = req.body || {};
    if (!specialistId || !preferredTimes || !contact) {
      return res.status(400).json({ error: 'specialistId, preferredTimes, and contact are required' });
    }
    const specialist = db.getSpecialist(specialistId);
    if (!specialist) return res.status(404).json({ error: 'Specialist not found' });

    const booking = db.createBooking(userId, { specialistId, preferredTimes, reason, contact });

    // Concierge MVP: no payment/video integration yet. A human ops person
    // follows up with the user via `contact` to confirm the consult and
    // collect payment. Wire up Stripe + a calendar link here once the
    // manual flow is validated (see README "Next steps after v0").
    return res.status(201).json({ booking });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
