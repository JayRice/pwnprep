import { auth } from "../database/firebase.ts";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Success() {
    const navigate = useNavigate();

    async function checkPremium() {
        // Force refresh the ID token
        const token = await auth.currentUser?.getIdTokenResult(true);
        return token?.claims?.premium === true;
    }

    useEffect(() => {
        const waitForPremium = async () => {
            const maxTries = 10;
            let tries = 0;

            while (tries < maxTries) {
                const isPremium = await checkPremium();
                if (isPremium) {
                    navigate("/");
                    return;
                }
                await new Promise((res) => setTimeout(res, 1000)); // wait 1s before next try
                tries++;
            }

            console.warn("❌ Premium claim not found after waiting.");
            navigate("/"); // fallback redirect even if claim doesn't show up
        };

        waitForPremium();
    }, []);

    return (
        <div className={"flex justify-center items-center"}>
            Premium activated! Reloading your instance, hold on...
        </div>
    );
}
