import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const TOKEN_KEY = 'femcare_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export const api = {
  signup: async (payload) => {
    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
    });
    if (error) throw new Error(error.message);
    
    if (data.user) {
      await supabase.from('users').upsert([{
        id: data.user.id,
        email: payload.email,
        password_hash: 'managed_by_supabase_auth',
        name: payload.name || ''
      }]);
    }
    if (data.session) setToken(data.session.access_token);
    return data;
  },

  login: async (payload) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    });
    if (error) throw new Error(error.message);
    if (data.session) setToken(data.session.access_token);
    return data;
  },

  me: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw new Error(error.message);
    if (!user) return null;

    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    return { ...user, ...(profile || {}) };
  },

  listLogs: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('cycle_logs')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw new Error(error.message);
    return data;
  },

  addLog: async (payload) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase.from('cycle_logs').insert([{
      id: 'log_' + Math.random().toString(36).substring(2, 9),
      user_id: user ? user.id : null,
      ...payload
    }]);
    if (error) throw new Error(error.message);
    return data;
  },

  deleteLog: async (id) => {
    const { error } = await supabase.from('cycle_logs').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return { success: true };
  },

  getReminders: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('users')
      .select('last_pap, last_breast_exam')
      .eq('id', user.id);

    if (error) throw new Error(error.message);
    return data;
  },

  updateScreening: async (payload) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not logged in");
    const { data, error } = await supabase.from('users').update(payload).eq('id', user.id);
    if (error) throw new Error(error.message);
    return data;
  },

  listSpecialists: async () => {
    const { data, error } = await supabase.from('specialists').select('*');
    if (error) throw new Error(error.message);
    return data;
  },

  listBookings: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw new Error(error.message);
    return data;
  },

  createBooking: async (payload) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase.from('bookings').insert([{
      id: 'bk_' + Math.random().toString(36).substring(2, 9),
      user_id: user ? user.id : null,
      specialist_id: payload.specialistId || payload.specialist_id,
      preferred_times: payload.preferredTimes || payload.preferred_times,
      reason: payload.reason,
      contact: payload.contact,
      status: 'requested'
    }]);
    if (error) throw new Error(error.message);
    return data;
  },
};