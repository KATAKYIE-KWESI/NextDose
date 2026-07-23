import { db } from './_lib/db.js';
import { getUserIdFromRequest, setCors } from './_lib/auth.js';

// Simplified, general screening-interval guidance for awareness purposes only.
// This is NOT medical advice and should be reviewed/adjusted with a clinician
// before this app is presented to real users. Keep the framing as "awareness
// reminders", never as a diagnostic claim.
function computeReminders(user) {
  const reminders = [];
  const age = user.birthYear ? new Date().getFullYear() - user.birthYear : null;

  const monthsSince = (isoDate) => {
    if (!isoDate) return Infinity;
    const diff = Date.now() - new Date(isoDate).getTime();
    return diff / (1000 * 60 * 60 * 24 * 30.44);
  };

  if (age === null || age >= 21) {
    const due = monthsSince(user.lastPap) >= 36; // ~3 years, simplified
    reminders.push({
      type: 'pap_smear',
      label: 'Pap smear / cervical screening',
      lastDate: user.lastPap,
      due,
      guidance: due
        ? 'It looks like it may be time for a routine cervical screening — worth booking with a specialist.'
        : 'You appear up to date. Reminder will resurface as the interval approaches.',
    });
  }

  if (age === null || age >= 20) {
    const due = monthsSince(user.lastBreastExam) >= 12; // annual, simplified
    reminders.push({
      type: 'breast_exam',
      label: 'Clinical breast exam',
      lastDate: user.lastBreastExam,
      due,
      guidance: due
        ? 'A routine clinical breast exam may be due — this is an awareness reminder, not a diagnosis.'
        : 'You appear up to date. Reminder will resurface as the interval approaches.',
    });
  }

  return reminders;
}

export default function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const userId = getUserIdFromRequest(req);
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  const user = db.getUserById(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (req.method === 'GET') {
    return res.status(200).json({ reminders: computeReminders(user) });
  }

  if (req.method === 'POST') {
    const { type, date } = req.body || {};
    if (!['pap_smear', 'breast_exam'].includes(type) || !date) {
      return res.status(400).json({ error: 'type must be pap_smear or breast_exam, and date is required' });
    }
    const patch = type === 'pap_smear' ? { lastPap: date } : { lastBreastExam: date };
    const updated = db.updateUser(userId, patch);
    return res.status(200).json({ reminders: computeReminders(updated) });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
