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

  fetchInvitation: async (token, id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/invitations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      set({ current: data });
      return data;
    } catch (err) {
      console.error(err);
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

  publishInvitation: async (token, id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/invitations/${id}/publish`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Publish failed');
      }
      const data = await res.json();
      set((state) => ({
        invitations: state.invitations.map((inv) => (inv.id === id ? data : inv)),
        current: data,
      }));
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  uploadPhoto: async (token, id, file, type = 'cover') => {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('type', type);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/invitations/${id}/photos`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Upload failed');
      }
      const data = await res.json();
      set((state) => ({
        invitations: state.invitations.map((inv) => (inv.id === id ? data : inv)),
        current: data,
      }));
      return data;
    } catch (err) {
      console.error(err);
      throw err;
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
