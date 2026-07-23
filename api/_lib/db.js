// ---------------------------------------------------------------------------
// MVP data layer.
//
// Vercel serverless functions are stateless between invocations, so this
// in-memory store is ONLY for local development / a demo deploy. Data will
// reset whenever a function cold-starts. Before onboarding real users
// (even the first 30-50 concierge testers), swap this for a real database.
//
// Fastest swap-in for Vercel: Vercel Postgres or a free Supabase/Neon
// Postgres instance + the `pg` package. The functions in this folder only
// call the methods below (getUser, createUser, addCycleLog, etc.) so you
// only need to rewrite THIS file — no changes to the /api routes.
//
// See README.md "Moving to a real database" for the schema + swap steps.
// ---------------------------------------------------------------------------

const store = globalThis.__femcare_store || {
  users: new Map(),       // id -> { id, email, passwordHash, name, birthYear, lastPap, lastBreastExam, createdAt }
  cycleLogs: new Map(),   // id -> { id, userId, date, type, symptoms, notes }
  specialists: new Map(), // id -> { id, name, specialty, languages, city, bio }
  bookings: new Map(),    // id -> { id, userId, specialistId, preferredTimes, reason, contact, status, createdAt }
};
globalThis.__femcare_store = store;

// Seed a couple of specialists on first load so the booking flow is demoable.
if (store.specialists.size === 0) {
  const seed = [
    {
      id: 'sp_1',
      name: 'Dr. Layla Haddad',
      specialty: 'Gynecology',
      languages: ['Arabic', 'English'],
      city: 'Dubai',
      bio: 'General gynecology, cycle irregularities, and preventive screening.',
    },
    {
      id: 'sp_2',
      name: 'Dr. Sara Al-Farsi',
      specialty: 'Gynecology & Fertility',
      languages: ['Arabic', 'English', 'French'],
      city: 'Riyadh',
      bio: 'Fertility counseling and reproductive health, women-only clinic.',
    },
  ];
  seed.forEach((s) => store.specialists.set(s.id, s));
}

const now = () => new Date().toISOString();
const id = (prefix) => `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;

export const db = {
  // ---- users ----
  getUserByEmail(email) {
    return [...store.users.values()].find((u) => u.email === email.toLowerCase()) || null;
  },
  getUserById(userId) {
    return store.users.get(userId) || null;
  },
  createUser({ email, passwordHash, name, birthYear }) {
    const user = {
      id: id('u'),
      email: email.toLowerCase(),
      passwordHash,
      name,
      birthYear: birthYear || null,
      lastPap: null,
      lastBreastExam: null,
      createdAt: now(),
    };
    store.users.set(user.id, user);
    return user;
  },
  updateUser(userId, patch) {
    const user = store.users.get(userId);
    if (!user) return null;
    Object.assign(user, patch);
    store.users.set(userId, user);
    return user;
  },

  // ---- cycle / symptom logs ----
  addCycleLog(userId, entry) {
    const log = {
      id: id('log'),
      userId,
      date: entry.date,
      type: entry.type, // 'period' | 'symptom'
      symptoms: entry.symptoms || [],
      flow: entry.flow || null, // light/medium/heavy for type=period
      notes: entry.notes || '',
      createdAt: now(),
    };
    store.cycleLogs.set(log.id, log);
    return log;
  },
  listCycleLogs(userId) {
    return [...store.cycleLogs.values()]
      .filter((l) => l.userId === userId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },
  deleteCycleLog(userId, logId) {
    const log = store.cycleLogs.get(logId);
    if (!log || log.userId !== userId) return false;
    store.cycleLogs.delete(logId);
    return true;
  },

  // ---- specialists ----
  listSpecialists() {
    return [...store.specialists.values()];
  },
  getSpecialist(specialistId) {
    return store.specialists.get(specialistId) || null;
  },

  // ---- bookings (concierge requests) ----
  createBooking(userId, { specialistId, preferredTimes, reason, contact }) {
    const booking = {
      id: id('bk'),
      userId,
      specialistId,
      preferredTimes,
      reason,
      contact,
      status: 'requested', // requested -> confirmed -> completed | cancelled
      createdAt: now(),
    };
    store.bookings.set(booking.id, booking);
    return booking;
  },
  listBookingsForUser(userId) {
    return [...store.bookings.values()]
      .filter((b) => b.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
};
