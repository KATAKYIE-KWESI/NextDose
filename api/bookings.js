import { db } from './_lib/db.js';
import { getUserIdFromRequest, setCors } from './_lib/auth.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) return res.status(401).json({ error: 'Not authenticated' });

    // GET: Fetch bookings for the logged-in user
    if (req.method === 'GET') {
      const bookings = await db.listBookingsForUser(userId);
      return res.status(200).json({ 
        bookings: Array.isArray(bookings) ? bookings : [] 
      });
    }

    // POST: Create a new booking request
    if (req.method === 'POST') {
      const { specialistId, preferredTimes, reason, contact } = req.body || {};
      if (!specialistId || !preferredTimes || !contact) {
        return res.status(400).json({ 
          error: 'specialistId, preferredTimes, and contact are required' 
        });
      }

      const specialist = await db.getSpecialist(specialistId);
      if (!specialist) {
        return res.status(404).json({ error: 'Specialist not found' });
      }

      const booking = await db.createBooking(userId, { 
        specialistId, 
        preferredTimes, 
        reason, 
        contact 
      });

      return res.status(201).json({ booking });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in /api/bookings:', error);
    return res.status(500).json({ error: 'Internal server error', bookings: [] });
  }
}