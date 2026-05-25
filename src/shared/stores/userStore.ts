import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { User, AudienceKey } from '@/entities';
import type { Mindset } from '@/data/mindsets';

export type CurrencyCode = 'ZAR' | 'USD' | 'EUR' | 'GBP' | 'AED';

interface UserState {
  user: User | null;
  audienceKey: AudienceKey | null;
  mindset: Mindset | null;
  hasSeenWelcome: boolean;
  soundEnabled: boolean;
  currency: CurrencyCode;
}

interface UserActions {
  setUser: (user: User) => void;
  setAudience: (key: AudienceKey) => void;
  setMindset: (mindset: Mindset) => void;
  markWelcomeSeen: () => void;
  setSoundEnabled: (enabled: boolean) => void;
  setCurrency: (currency: CurrencyCode) => void;
  clear: () => void;
}

const INITIAL: UserState = {
  user: null,
  audienceKey: null,
  mindset: null,
  hasSeenWelcome: false,
  soundEnabled: true,
  currency: 'ZAR',
};

export const useUserStore = create<UserState & UserActions>()(
  devtools(
    persist(
      immer((set) => ({
        ...INITIAL,

        setUser: (user) =>
          set((s) => { s.user = user; }, false, 'user/setUser'),

        setAudience: (key) =>
          set((s) => { s.audienceKey = key; }, false, 'user/setAudience'),

        setMindset: (mindset) =>
          set((s) => { s.mindset = mindset; }, false, 'user/setMindset'),

        markWelcomeSeen: () =>
          set((s) => { s.hasSeenWelcome = true; }, false, 'user/markWelcomeSeen'),

        setSoundEnabled: (enabled) =>
          set((s) => { s.soundEnabled = enabled; }, false, 'user/setSoundEnabled'),

        setCurrency: (currency) =>
          set((s) => { s.currency = currency; }, false, 'user/setCurrency'),

        clear: () =>
          set(() => ({ ...INITIAL }), false, 'user/clear'),
      })),
      {
        name: 'finlit-user-v1',
        partialize: (s) => ({
          user: s.user,
          audienceKey: s.audienceKey,
          mindset: s.mindset ? { id: s.mindset.id } : null,
          hasSeenWelcome: s.hasSeenWelcome,
          soundEnabled: s.soundEnabled,
          currency: s.currency,
        }),
      }
    ),
    { name: 'UserStore', enabled: import.meta.env.DEV }
  )
);

// Typed selectors — subscribe to only what you need, avoid full-store re-renders
export const selectUser = (s: UserState & UserActions) => s.user;
export const selectMindset = (s: UserState & UserActions) => s.mindset;
export const selectAudienceKey = (s: UserState & UserActions) => s.audienceKey;
