import { create } from 'zustand';

interface ScrollStore {
  scrollProgress: number;
  setScrollProgress: (progress: number) => void;
}

export const useScrollStore = create<ScrollStore>((set) => ({
  scrollProgress: 0,
  setScrollProgress: (progress) =>
    set((state) =>
      Math.abs(state.scrollProgress - progress) < 0.001
        ? state
        : { scrollProgress: progress },
    ),
}));
