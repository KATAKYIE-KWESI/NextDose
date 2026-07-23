import { createClient } from '@supabase/supabase-js';

// 1. Initialize Supabase using Vite's environment variables
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

// 2. Map your API functions directly to Supabase queries
export const api = {
  signup: async (payload) => {
    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
    });
    if (error) throw new Error(error.message);
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
    return user;
  },

  listLogs: async () => {
    const { data, error } = await supabase.from('cycle_logs').select('*');
    if (error) throw new Error(error.message);
    return data;
  },

  addLog: async (payload) => {
    const { data, error } = await supabase.from('cycle_logs').insert([payload]);
    if (error) throw new Error(error.message);
    return data;
  },

  deleteLog: async (id) => {
    const { error } = await supabase.from('cycle_logs').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return { success: true };
  },

  getReminders: async () => {
    const { data, error } = await supabase.from('screening').select('*');
    if (error) throw new Error(error.message);
    return data;
  },

  updateScreening: async (payload) => {
    const { data, error } = await supabase.from('screening').upsert([payload]);
    if (error) throw new Error(error.message);
    return data;
  },

  listSpecialists: async () => {
    const { data, error } = await supabase.from('specialists').select('*');
    if (error) throw new Error(error.message);
    return data;
  },

  listBookings: async () => {
    const { data, error } = await supabase.from('bookings').select('*');
    if (error) throw new Error(error.message);
    return data;
  },

  createBooking: async (payload) => {
    const { data, error } = await supabase.from('bookings').insert([payload]);
    if (error) throw new Error(error.message);
    return data;
  },
};