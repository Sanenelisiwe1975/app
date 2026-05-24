import { describe, it, expect, beforeEach } from 'vitest';
import { useUserStore } from '@/shared/stores/userStore';

const MOCK_USER = {
  name: 'Sipho',
  surname: 'Dlamini',
  age: '25',
  location: 'Soweto',
  audience: 'youth' as const,
  mindset: 'spaza',
};

beforeEach(() => {
  useUserStore.getState().clear();
});

//setUser

describe('setUser', () => {
  it('stores the user object', () => {
    useUserStore.getState().setUser(MOCK_USER);
    expect(useUserStore.getState().user).toEqual(MOCK_USER);
  });
});

// setAudience

describe('setAudience', () => {
  it('stores the audience key', () => {
    useUserStore.getState().setAudience('corporate');
    expect(useUserStore.getState().audienceKey).toBe('corporate');
  });
});

//setMindset

describe('setMindset', () => {
  it('stores a partial mindset object', () => {
    const mockMindset = { id: 'spaza', name: 'Spaza Shop Owner' } as any;
    useUserStore.getState().setMindset(mockMindset);
    expect(useUserStore.getState().mindset?.id).toBe('spaza');
  });
});

// clear

describe('clear', () => {
  it('resets all user state to null', () => {
    useUserStore.getState().setUser(MOCK_USER);
    useUserStore.getState().setAudience('youth');
    useUserStore.getState().clear();
    const { user, audienceKey, mindset } = useUserStore.getState();
    expect(user).toBeNull();
    expect(audienceKey).toBeNull();
    expect(mindset).toBeNull();
  });
});
