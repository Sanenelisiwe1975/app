import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export type Page =
  | 'splash'
  | 'register'
  | 'mindset'
  | 'dashboard'
  | 'learn'
  | 'market'
  | 'portfolio'
  | 'stokvel'
  | 'timemachine'
  | 'antiscam'
  | 'wealthybody'
  | 'emotion'
  | 'prophet'
  | 'certificate'
  | 'switch';

interface UiState {
  page: Page;
  sidebarOpen: boolean;
  activeModal: string | null;
}

interface UiActions {
  navigate: (page: Page) => void;
  toggleSidebar: () => void;
  openModal: (id: string) => void;
  closeModal: () => void;
}

export const useUiStore = create<UiState & UiActions>()(
  devtools(
    immer((set) => ({
      page: 'splash',
      sidebarOpen: false,
      activeModal: null,

      navigate: (page) =>
        set((s) => { s.page = page; }, false, `ui/navigate:${page}`),

      toggleSidebar: () =>
        set((s) => { s.sidebarOpen = !s.sidebarOpen; }, false, 'ui/toggleSidebar'),

      openModal: (id) =>
        set((s) => { s.activeModal = id; }, false, `ui/openModal:${id}`),

      closeModal: () =>
        set((s) => { s.activeModal = null; }, false, 'ui/closeModal'),
    })),
    { name: 'UiStore', enabled: import.meta.env.DEV }
  )
);
