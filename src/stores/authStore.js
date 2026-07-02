import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();
      localStorage.setItem('token', data.token);
      set({ user: data.user, token: data.token, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  signup: async (email, password, fullName) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName }),
      });
      if (!res.ok) throw new Error('Signup failed');
      const data = await res.json();
      localStorage.setItem('token', data.token);
      set({ user: data.user, token: data.token, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));

export default useAuthStore;
