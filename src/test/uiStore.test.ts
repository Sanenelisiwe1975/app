import { describe, it, expect, beforeEach } from 'vitest';
import { useUiStore } from '@/shared/stores/uiStore';

beforeEach(() => {
  useUiStore.setState({ page: 'splash', sidebarOpen: false, activeModal: null });
});

// navigate

describe('navigate', () => {
  it('updates the active page', () => {
    useUiStore.getState().navigate('dashboard');
    expect(useUiStore.getState().page).toBe('dashboard');
  });

  it('navigates through multiple pages correctly', () => {
    const { navigate } = useUiStore.getState();
    navigate('market');
    expect(useUiStore.getState().page).toBe('market');
    navigate('learn');
    expect(useUiStore.getState().page).toBe('learn');
  });
});

// toggleSidebar

describe('toggleSidebar', () => {
  it('toggles sidebarOpen from false to true and back', () => {
    expect(useUiStore.getState().sidebarOpen).toBe(false);
    useUiStore.getState().toggleSidebar();
    expect(useUiStore.getState().sidebarOpen).toBe(true);
    useUiStore.getState().toggleSidebar();
    expect(useUiStore.getState().sidebarOpen).toBe(false);
  });
});

// openModal / closeModal

describe('openModal / closeModal', () => {
  it('sets and clears the active modal', () => {
    expect(useUiStore.getState().activeModal).toBeNull();
    useUiStore.getState().openModal('quiz');
    expect(useUiStore.getState().activeModal).toBe('quiz');
    useUiStore.getState().closeModal();
    expect(useUiStore.getState().activeModal).toBeNull();
  });

  it('replaces the modal when opened twice without closing', () => {
    useUiStore.getState().openModal('first');
    useUiStore.getState().openModal('second');
    expect(useUiStore.getState().activeModal).toBe('second');
  });
});
