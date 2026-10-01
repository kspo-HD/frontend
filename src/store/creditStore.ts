import { create } from 'zustand';
import client from '../api/client';

interface CreditState {
  credits: number | null;
  setCredits: (n: number) => void;
  fetchCredits: () => Promise<void>;
  decrement: () => void;
}

export const useCreditStore = create<CreditState>((set, get) => ({
  credits: null,

  setCredits: (n) => set({ credits: n }),

  fetchCredits: async () => {
    try {
      const res = await client.get('/api/v1/credits/remaining');
      set({ credits: res.data.count ?? res.data });
    } catch {}
  },

  decrement: () => {
    const cur = get().credits;
    if (cur !== null) set({ credits: Math.max(0, cur - 1) });
  },
}));
