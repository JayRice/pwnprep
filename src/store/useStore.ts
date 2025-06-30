import { create } from 'zustand';
import { persist } from 'zustand/middleware';


import {CustomParam} from "../data/interfaces.ts"

interface Store {
    isPremium: boolean;

    setIsPremium: (value: boolean) => void;
    customParams: CustomParam[];
    setCustomParams: (customParams: CustomParam[]) => void;
    customParamsChanged: boolean;
    setCustomParamsChanged: (value: boolean) => void;
    AIMessage: string;
    setAIMessage: (message: string) => void;
}


export const useStore = create<Store>()(
    persist(
        (set) => ({
            isPremium: false,
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