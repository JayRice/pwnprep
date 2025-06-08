import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { TargetParams } from '../data/interfaces.ts';
import {PLACEHOLDERS} from '../regex/regex.ts'

interface Store {
    targetParams: TargetParams;
    isPremium: boolean;
    setTargetParams: (params: Partial<TargetParams>) => void;
    setIsPremium: (value: boolean) => void;
}

const defaultParams: TargetParams = PLACEHOLDERS.reduce((acc, key) => {
    acc[key] = '';
    return acc;
}, {} as TargetParams);

export const useStore = create<Store>()(
    persist(
        (set) => ({
            targetParams: defaultParams,
            isPremium: false,
            setTargetParams: (params) =>{
                console.log(params);
                set((state) => ({

                    targetParams: { ...state.targetParams, ...params },
                }))
            },
            setIsPremium: (value) => set({ isPremium: value }),
        }),
        {
            name: 'pwnprep-storage',
        }
    )
);