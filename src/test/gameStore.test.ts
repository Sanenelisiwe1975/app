import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore, selectHealthMultiplier } from '@/shared/stores/gameStore';

// Reset store to initial state before every test
beforeEach(() => {
  useGameStore.getState().reset();
});

// initMindset

describe('initMindset', () => {
  it('sets the starting cash and clears progress', () => {
    useGameStore.getState().initMindset(5000);
    const { cash, xp, badges, completedModules } = useGameStore.getState();
    expect(cash).toBe(5000);
    expect(xp).toBe(0);
    expect(badges).toHaveLength(0);
    expect(completedModules).toHaveLength(0);
  });
});

//addCash

describe('addCash', () => {
  it('increases cash by delta', () => {
    useGameStore.getState().initMindset(1000);
    useGameStore.getState().addCash(500);
    expect(useGameStore.getState().cash).toBe(1500);
  });

  it('does not let cash go below zero', () => {
    useGameStore.getState().initMindset(100);
    useGameStore.getState().addCash(-500);
    expect(useGameStore.getState().cash).toBe(0);
  });
});

//buyShares / sellShares

describe('buyShares', () => {
  it('deducts cash and records shares', () => {
    useGameStore.getState().initMindset(10_000);
    const success = useGameStore.getState().buyShares('JSE', 2, 1000);
    const { cash, shares, totalTrades } = useGameStore.getState();
    expect(success).toBe(true);
    expect(cash).toBe(8000);
    expect(shares['JSE']).toBe(2);
    expect(totalTrades).toBe(1);
  });

  it('returns false and makes no changes when cash is insufficient', () => {
    useGameStore.getState().initMindset(500);
    const success = useGameStore.getState().buyShares('JSE', 1, 1000);
    expect(success).toBe(false);
    expect(useGameStore.getState().cash).toBe(500);
    expect(useGameStore.getState().shares['JSE']).toBeUndefined();
  });
});

describe('sellShares', () => {
  it('adds cash and removes shares', () => {
    useGameStore.getState().initMindset(10_000);
    useGameStore.getState().buyShares('JSE', 3, 1000);
    const success = useGameStore.getState().sellShares('JSE', 2, 1200);
    const { cash, shares } = useGameStore.getState();
    expect(success).toBe(true);
    expect(cash).toBe(10_000 - 3_000 + 2_400); // 9400
    expect(shares['JSE']).toBe(1);
  });

  it('returns false when not enough shares to sell', () => {
    useGameStore.getState().initMindset(10_000);
    const success = useGameStore.getState().sellShares('JSE', 5, 1000);
    expect(success).toBe(false);
  });

  it('removes the key entirely when all shares are sold', () => {
    useGameStore.getState().initMindset(10_000);
    useGameStore.getState().buyShares('JSE', 1, 1000);
    useGameStore.getState().sellShares('JSE', 1, 1000);
    expect(useGameStore.getState().shares['JSE']).toBeUndefined();
  });
});

// completeModule

describe('completeModule', () => {
  it('awards 100 XP on first completion', () => {
    useGameStore.getState().completeModule(1);
    expect(useGameStore.getState().xp).toBe(100);
    expect(useGameStore.getState().completedModules).toContain(1);
  });

  it('does not double-award XP for the same module', () => {
    useGameStore.getState().completeModule(1);
    useGameStore.getState().completeModule(1);
    expect(useGameStore.getState().xp).toBe(100);
    expect(useGameStore.getState().completedModules.filter((id) => id === 1)).toHaveLength(1);
  });
});

// recordPhishing

describe('recordPhishing', () => {
  it('awards cash and XP for correct identification', () => {
    useGameStore.getState().initMindset(1000);
    useGameStore.getState().recordPhishing(true);
    const { cash, xp, phishingCaught, phishingTotal } = useGameStore.getState();
    expect(cash).toBe(1200);
    expect(xp).toBe(15);
    expect(phishingCaught).toBe(1);
    expect(phishingTotal).toBe(1);
  });

  it('deducts cash on missed phishing', () => {
    useGameStore.getState().initMindset(1000);
    useGameStore.getState().recordPhishing(false);
    expect(useGameStore.getState().cash).toBe(500);
    expect(useGameStore.getState().phishingCaught).toBe(0);
  });
});

//contributeStokvel

describe('contributeStokvel', () => {
  it('returns false when cash is below R100', () => {
    useGameStore.getState().initMindset(50);
    const success = useGameStore.getState().contributeStokvel();
    expect(success).toBe(false);
    expect(useGameStore.getState().cash).toBe(50);
  });

  it('deducts R100 from cash and increases the pot', () => {
    useGameStore.getState().initMindset(500);
    useGameStore.getState().contributeStokvel();
    // pot = 100 * 3 members = 300
    expect(useGameStore.getState().community.pot).toBe(300);
    expect(useGameStore.getState().cash).toBe(400);
  });
});

// blockImpulse

describe('blockImpulse', () => {
  it('increments blocked count, awards R200 and 10 XP', () => {
    useGameStore.getState().initMindset(0);
    useGameStore.getState().blockImpulse();
    const { impulseSpendsBlocked, cash, xp } = useGameStore.getState();
    expect(impulseSpendsBlocked).toBe(1);
    expect(cash).toBe(200);
    expect(xp).toBe(10);
  });
});

// selectHealthMultiplier

describe('selectHealthMultiplier', () => {
  it('returns 1.0 at zero steps and 0 hours sleep', () => {
    useGameStore.setState((s) => ({ ...s, health: { steps: 0, sleep: 0, heartRate: 72 } }));
    expect(selectHealthMultiplier(useGameStore.getState() as any)).toBeCloseTo(1.0, 2);
  });

  it('returns ~1.3 at 10000 steps and 8 hours sleep', () => {
    useGameStore.setState((s) => ({ ...s, health: { steps: 10_000, sleep: 8, heartRate: 65 } }));
    expect(selectHealthMultiplier(useGameStore.getState() as any)).toBeCloseTo(1.3, 2);
  });
});
