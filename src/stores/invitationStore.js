import { create } from 'zustand';

const useInvitationStore = create((set) => ({
  invitations: [],
  current: null,
  guests: [],
  loading: false,

  fetchInvitations: async (token) => {
    set({ loading: true });
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/invitations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      set({ invitations: data, loading: false });
    } catch (err) {
      set({ loading: false });
    }
  },

  createInvitation: async (token, invitation) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/invitations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(invitation),
      });
      const data = await res.json();
      set((state) => ({ invitations: [data, ...state.invitations], current: data }));
      return data;
    } catch (err) {
      console.error(err);
    }
  },

  updateInvitation: async (token, id, updates) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/invitations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      set((state) => ({
        invitations: state.invitations.map((inv) => (inv.id === id ? data : inv)),
        current: data,
      }));
    } catch (err) {
      console.error(err);
    }
  },

  fetchGuests: async (token, invitationId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/invitations/${invitationId}/guests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      set({ guests: data });
    } catch (err) {
      console.error(err);
    }
  },

  addGuest: async (token, invitationId, guest) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/invitations/${invitationId}/guests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(guest),
      });
      const data = await res.json();
      set((state) => ({ guests: [...state.guests, data] }));
    } catch (err) {
      console.error(err);
    }
  },
}));

export default useInvitationStore;
