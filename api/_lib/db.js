import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// 1. Explicitly load .env.local first, then fallback to standard .env
dotenv.config({ path: '.env.local' });
dotenv.config();

// 2. Load Supabase credentials from environment variables
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;

const supabaseKey = 
  process.env.SUPABASE_SECRET_KEY ||            // Matches Supabase's new Secret Key
  process.env.SUPABASE_PUBLISHABLE_KEY ||        // Matches Supabase's new Publishable Key
  process.env.SUPABASE_SERVICE_ROLE_KEY || 
  process.env.SUPABASE_ANON_KEY || 
  process.env.VITE_SUPABASE_ANON_KEY || 
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase credentials missing from environment variables!');
}

// 3. Fallback to empty string to prevent total server startup crash
const supabase = createClient(supabaseUrl || '', supabaseKey || '');

const now = () => new Date().toISOString();
const generateId = (prefix) => `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;

export const db = {
  // ---- USERS ----
  async getUserByEmail(email) {
    if (!email) return null;
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (!data) return null;

    return {
      id: data.id,
      email: data.email,
      passwordHash: data.password_hash,
      name: data.name,
      birthYear: data.birth_year,
      lastPap: data.last_pap,
      lastBreastExam: data.last_breast_exam,
      createdAt: data.created_at,
    };
  },

  async getUserById(userId) {
    if (!userId) return null;
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (!data) return null;

    return {
      id: data.id,
      email: data.email,
      passwordHash: data.password_hash,
      name: data.name,
      birthYear: data.birth_year,
      lastPap: data.last_pap,
      lastBreastExam: data.last_breast_exam,
      createdAt: data.created_at,
    };
  },

  async createUser({ email, passwordHash, name, birthYear }) {
    const user = {
      id: generateId('u'),
      email: email.toLowerCase(),
      password_hash: passwordHash,
      name,
      birth_year: birthYear || null,
      last_pap: null,
      last_breast_exam: null,
      created_at: now(),
    };

    const { data, error } = await supabase.from('users').insert([user]).select().single();
    if (error) throw error;

    return {
      id: data.id,
      email: data.email,
      passwordHash: data.password_hash,
      name: data.name,
      birthYear: data.birth_year,
      lastPap: data.last_pap,
      lastBreastExam: data.last_breast_exam,
      createdAt: data.created_at,
    };
  },

  async updateUser(userId, patch) {
    const payload = {};
    if (patch.name !== undefined) payload.name = patch.name;
    if (patch.birthYear !== undefined) payload.birth_year = patch.birthYear;
    if (patch.lastPap !== undefined) payload.last_pap = patch.lastPap;
    if (patch.lastBreastExam !== undefined) payload.last_breast_exam = patch.lastBreastExam;

    const { data, error } = await supabase
      .from('users')
      .update(payload)
      .eq('id', userId)
      .select()
      .single();

    if (error) return null;

    return {
      id: data.id,
      email: data.email,
      passwordHash: data.password_hash,
      name: data.name,
      birthYear: data.birth_year,
      lastPap: data.last_pap,
      lastBreastExam: data.last_breast_exam,
      createdAt: data.created_at,
    };
  },

  // ---- CYCLE / SYMPTOM LOGS ----
  async addCycleLog(userId, entry) {
    const log = {
      id: generateId('log'),
      user_id: userId,
      date: entry.date,
      type: entry.type,
      symptoms: entry.symptoms || [],
      flow: entry.flow || null,
      notes: entry.notes || '',
      created_at: now(),
    };

    const { data, error } = await supabase.from('cycle_logs').insert([log]).select().single();
    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      date: data.date,
      type: data.type,
      symptoms: data.symptoms,
      flow: data.flow,
      notes: data.notes,
      createdAt: data.created_at,
    };
  },

  async listCycleLogs(userId) {
    const { data, error } = await supabase
      .from('cycle_logs')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) return [];

    return data.map((l) => ({
      id: l.id,
      userId: l.user_id,
      date: l.date,
      type: l.type,
      symptoms: l.symptoms,
      flow: l.flow,
      notes: l.notes,
      createdAt: l.created_at,
    }));
  },

  async deleteCycleLog(userId, logId) {
    const { error } = await supabase
      .from('cycle_logs')
      .delete()
      .eq('id', logId)
      .eq('user_id', userId);

    return !error;
  },

  // ---- SPECIALISTS ----
  async listSpecialists() {
    const { data, error } = await supabase.from('specialists').select('*');
    if (error || !data) return [];

    return data.map((s) => ({
      id: s.id,
      name: s.name,
      specialty: s.specialty,
      languages: s.languages,
      city: s.city,
      bio: s.bio,
      imageUrl: s.image_url,
    }));
  },

  async getSpecialist(specialistId) {
    const { data } = await supabase
      .from('specialists')
      .select('*')
      .eq('id', specialistId)
      .single();

    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      specialty: data.specialty,
      languages: data.languages,
      city: data.city,
      bio: data.bio,
      imageUrl: data.image_url,
    };
  },

  // ---- BOOKINGS (CONCIERGE REQUESTS) ----
  async createBooking(userId, { specialistId, preferredTimes, reason, contact }) {
    const booking = {
      id: generateId('bk'),
      user_id: userId,
      specialist_id: specialistId,
      preferred_times: preferredTimes,
      reason: reason || '',
      contact,
      status: 'requested',
      created_at: now(),
    };

    const { data, error } = await supabase.from('bookings').insert([booking]).select().single();
    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      specialistId: data.specialist_id,
      preferredTimes: data.preferred_times,
      reason: data.reason,
      contact: data.contact,
      status: data.status,
      createdAt: data.created_at,
    };
  },

  async listBookingsForUser(userId) {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map((b) => ({
      id: b.id,
      userId: b.user_id,
      specialistId: b.specialist_id,
      preferredTimes: b.preferred_times,
      reason: b.reason,
      contact: b.contact,
      status: b.status,
      createdAt: b.created_at,
    }));
  },
};