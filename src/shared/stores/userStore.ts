import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { User, AudienceKey } from '@/entities';
import type { Mindset } from '@/data/mindsets';

interface UserState {
  user: User | null;
  audienceKey: AudienceKey | null;
  mindset: Mindset | null;
}

interface UserActions {
  setUser: (user: User) => void;
  setAudience: (key: AudienceKey) => void;
  setMindset: (mindset: Mindset) => void;
  clear: () => void;
}

const INITIAL: UserState = {
  user: null,
  audienceKey: null,
  mindset: null,
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

        clear: () =>
          set(() => ({ ...INITIAL }), false, 'user/clear'),
      })),
      {
        name: 'finlit-user-v1',
        // Only persist the mindset ID — full object is re-hydrated from static data on boot
        partialize: (s) => ({
          user: s.user,
          audienceKey: s.audienceKey,
          mindset: s.mindset ? { id: s.mindset.id } : null,
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
