import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface QuizModuleState {
  trainingSeen: boolean;
  quizTaken: boolean;
  score: number | null;
}

export interface OffenderRecord {
  id: string;
  name: string;
  scores: number[];          // 5 entries — 0 or 20 per module
  certIssued: boolean;
  quizState: Record<string, QuizModuleState>; // string keys survive JSON round-trip
}

export interface FacilitatorSession {
  name: string;
  role: 'facilitator' | 'commander';
}

const DEFAULT_OFFENDERS: OffenderRecord[] = [
  { id: 'SAPS001', name: 'Themba Nkosi',   scores: [20,20,20,20,20], certIssued: true,  quizState: {} },
  { id: 'SAPS002', name: 'Lerato Dlamini', scores: [20,0,20,20,0],   certIssued: false, quizState: {} },
  { id: 'SAPS003', name: 'Thabo Molefe',   scores: [0,0,20,20,20],   certIssued: false, quizState: {} },
];

interface SynchroState {
  session: FacilitatorSession | null;
  offenders: OffenderRecord[];
  lastSync: number | null;
}

interface SynchroActions {
  login: (name: string, role: 'facilitator' | 'commander') => void;
  logout: () => void;
  addOffender: (name: string) => void;
  markTrainingSeen: (offenderId: string, moduleIdx: number) => void;
  submitQuiz: (offenderId: string, moduleIdx: number, correctCount: number) => void;
  resetQuiz: (offenderId: string, moduleIdx: number) => void;
  issueCert: (offenderId: string) => boolean;
  sync: () => void;
}

export const useSynchroStore = create<SynchroState & SynchroActions>()(
  devtools(
    persist(
      immer((set, get) => ({
        session: null,
        offenders: DEFAULT_OFFENDERS.map((o) => ({ ...o, quizState: {} })),
        lastSync: null,

        login: (name, role) =>
          set((s) => { s.session = { name, role }; }, false, 'synchro/login'),

        logout: () =>
          set((s) => { s.session = null; }, false, 'synchro/logout'),

        addOffender: (name) =>
          set((s) => {
            const num = String(s.offenders.length + 100).padStart(3, '0');
            s.offenders.push({ id: `SAPS${num}`, name, scores: [0,0,0,0,0], certIssued: false, quizState: {} });
          }, false, 'synchro/addOffender'),

        markTrainingSeen: (offenderId, moduleIdx) =>
          set((s) => {
            const off = s.offenders.find((o) => o.id === offenderId);
            if (!off) return;
            const key = String(moduleIdx);
            if (!off.quizState[key]) off.quizState[key] = { trainingSeen: false, quizTaken: false, score: null };
            off.quizState[key].trainingSeen = true;
          }, false, 'synchro/markTrainingSeen'),

        submitQuiz: (offenderId, moduleIdx, correctCount) =>
          set((s) => {
            const off = s.offenders.find((o) => o.id === offenderId);
            if (!off) return;
            const key = String(moduleIdx);
            if (!off.quizState[key]) off.quizState[key] = { trainingSeen: true, quizTaken: false, score: null };
            off.quizState[key].quizTaken = true;
            off.quizState[key].score = correctCount;
            off.scores[moduleIdx] = correctCount >= 3 ? 20 : 0;
          }, false, 'synchro/submitQuiz'),

        resetQuiz: (offenderId, moduleIdx) =>
          set((s) => {
            const off = s.offenders.find((o) => o.id === offenderId);
            if (!off) return;
            delete off.quizState[String(moduleIdx)];
            off.scores[moduleIdx] = 0;
          }, false, 'synchro/resetQuiz'),

        issueCert: (offenderId) => {
          const off = get().offenders.find((o) => o.id === offenderId);
          if (!off || off.certIssued) return false;
          const total = off.scores.reduce((a, b) => a + b, 0);
          if (total < 60) return false;
          set((s) => {
            const o = s.offenders.find((x) => x.id === offenderId);
            if (o) o.certIssued = true;
          }, false, 'synchro/issueCert');
          return true;
        },

        sync: () =>
          set((s) => { s.lastSync = Date.now(); }, false, 'synchro/sync'),
      })),
      { name: 'finlit-synchro-v1' }
    ),
    { name: 'SynchroStore', enabled: import.meta.env.DEV }
  )
);

export function totalScore(scores: number[]): number {
  return scores.reduce((a, b) => a + b, 0);
}
