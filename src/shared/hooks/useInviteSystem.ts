import type { Invite } from '@/shared/stores/gameStore';

export function generateInviteCode(): string {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  return 'FINLIT-' + Array.from(bytes).map((b) => b.toString(16).padStart(2, '0').toUpperCase()).join('');
}

export function buildInviteUrl(invite: Invite): string {
  const base = window.location.origin + window.location.pathname;
  const params = new URLSearchParams({
    ref: invite.code,
    exp: invite.expiresAt.toString(),
    max: invite.maxUses.toString(),
    msg: invite.message,
    from: invite.fromName,
  });
  return `${base}?${params.toString()}`;
}

export interface ParsedInvite {
  code: string;
  expiresAt: number;
  maxUses: number;
  message: string;
  fromName: string;
}

export function parseInviteUrl(): ParsedInvite | null {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get('ref');
  const exp = params.get('exp');
  if (!ref || !exp || !ref.startsWith('FINLIT-')) return null;
  return {
    code: ref,
    expiresAt: parseInt(exp, 10),
    maxUses: parseInt(params.get('max') ?? '10', 10),
    message: params.get('msg') ?? '',
    fromName: params.get('from') ?? 'A friend',
  };
}

export function formatCountdown(expiresAt: number, now: number): string {
  const diff = expiresAt - now;
  if (diff <= 0) return 'Expired';
  const totalMinutes = Math.floor(diff / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    const remH = hours % 24;
    return `${days}d ${remH}h`;
  }
  return `${hours}h ${minutes}m`;
}
