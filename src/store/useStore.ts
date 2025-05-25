import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TargetParams {
  ip: string;
  port: string;
  service: string;
  wordlist: string;
}

interface Store {
  targetParams: TargetParams;
  isPremium: boolean;
  setTargetParams: (params: Partial<TargetParams>) => void;
  setIsPremium: (value: boolean) => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      targetParams: {
        ip: '',
        port: '',
        service: '',
        wordlist: '',
      },
      isPremium: false,
      setTargetParams: (params) =>
        set((state) => ({
          targetParams: { ...state.targetParams, ...params },
        })),
      setIsPremium: (value) => set({ isPremium: value }),
    }),
    {
      name: 'pwnprep-storage',
    }
  )
);