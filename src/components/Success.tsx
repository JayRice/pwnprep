import {auth} from "../database/firebase.ts"
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
export default function Success() {

    async function reloadUser(){
        await auth.currentUser?.getIdToken(true);
    }

    const navigate = useNavigate();


    useEffect(() => {
        reloadUser().then(() => {
            navigate("/");
        });

    })

    return (
        <div className={"flex justify-center items-center"}>Premium activated! Reloading your instance, hold on... </div>
    )

}