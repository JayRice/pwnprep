import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { TargetParams } from '../data/interfaces.ts';
import {PLACEHOLDERS} from "../data/data.ts"

import {CustomParam} from "../data/interfaces.ts"

interface Store {
    targetParams: TargetParams;
    isPremium: boolean;
    setTargetParams: (params: Partial<TargetParams>) => void;
    setIsPremium: (value: boolean) => void;
    customParams: CustomParam[];
    setCustomParams: (customParams: CustomParam[]) => void;
    customParamsChanged: boolean;
    setCustomParamsChanged: (value: boolean) => void;
    AIMessage: string;
    setAIMessage: (message: string) => void;
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
            setCustomParams: (customParams) =>{
                set(() => ({
                    customParams: customParams
                }))
            },
            customParamsChanged: false,
            setCustomParamsChanged: (value) => set({customParamsChanged: value}),
            customParams: [],
            AIMessage: '',
            setAIMessage: (message: string) =>set({ AIMessage: message }),

        }),
        {
            name: 'pwnprep-storage',
        }
    )
);