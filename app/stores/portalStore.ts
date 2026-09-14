import { create } from 'zustand';

export type PortalId = 'work' | 'projects' | 'certificates';
type PortalPhase = 'idle' | 'entering' | 'active' | 'exiting';

interface PortalStore {
  activePortalId: PortalId | null;
  phase: PortalPhase;
  openPortal: (portalId: PortalId) => void;
  closePortal: () => void;
  completeOpening: (portalId: PortalId) => void;
  completeClosing: (portalId: PortalId) => void;
}

export const usePortalStore = create<PortalStore>((set) => ({
  activePortalId: null,
  phase: 'idle',
  openPortal: (activePortalId) => set((state) => (
    state.phase === 'idle'
      ? { activePortalId, phase: 'entering' }
      : state
  )),
  closePortal: () => set((state) => (
    state.activePortalId && state.phase !== 'exiting'
      ? { phase: 'exiting' }
      : state
  )),
  completeOpening: (portalId) => set((state) => (
    state.activePortalId === portalId && state.phase === 'entering'
      ? { phase: 'active' }
      : state
  )),
  completeClosing: (portalId) => set((state) => (
    state.activePortalId === portalId && state.phase === 'exiting'
      ? { activePortalId: null, phase: 'idle' }
      : state
  )),
}))
