import { auth } from "../database/firebase.ts";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import LoadingSpinner from "./LoadingSpinner.tsx";
import {useStore} from "../store/useStore.ts";

export default function Success() {
    const navigate = useNavigate();

    async function checkPremium() {
        // Force refresh the ID token
        const token = await auth.currentUser?.getIdTokenResult(true);
        return token?.claims?.premium === true;
    }

    const setPremium = useStore((store) => store.setIsPremium);


    useEffect(() => {
        const waitForPremium = async () => {
            const maxTries = 10;
            let tries = 0;

            while (tries < maxTries) {
                const isPremium = await checkPremium();
                if (isPremium) {
                    setPremium(true);
                    navigate("/");
                    return;
                }
                await new Promise((res) => setTimeout(res, 1000)); // wait 1s before next try
                tries++;
            }

            navigate("/");
        };

        waitForPremium();
    }, []);

    return (
        <div className={"flex justify-center flex-col gap-16 items-center relative mt-32"}>
            <h1 className={"text-xl font-bold"}>Premium activated! Reloading your instance, hold on...</h1>
            <LoadingSpinner  spinnerClassName={"bg-purple-600"}></LoadingSpinner>
        </div>
    );
}
