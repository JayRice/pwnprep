import {isPremium} from "../database/database.ts";
import {useEffect, useState} from "react";

import {Link} from "react-router-dom";
interface Props {
    user:import('firebase/auth').User | null;
}
export default function ProfilePage({user} : Props) {
    const [premium, setPremium] = useState(false);

    useEffect(() => {
        if(!user) {return}
        isPremium().then((response) => {
            setPremium(response);
        });


    }, [])
    if (!user) {

        return (
            <Link to={"/"} >No User Logged In, Go back home.</Link>
        )
    }
    /*
    * providerData : [{"providerId":"google.com","uid":"102870588615729799220","displayName":"Jayden R","email":"jayjrice1@gmail.com","phoneNumber":null,"photoURL":"https://lh3.googleusercontent.com/a/ACg8ocKJYNVzZnwVkGp4B8AhBv71gwN46WShy5BftH7Lq2KCaCHDyg=s96-c"}]
    * */
    return (
        <div className={"flex justify-center w-full h-full"}>

            <div className=" w-[40vw] h-[70vh] rounded-lg bg-purple-600 mt-12 text-white p-4">

                <h1 className={"font-bold text-3xl mt-4 text-center mb-6"}> Profile </h1>

                <p className="text-white-600 text-2xl mb-6"> User Id: {user.uid}</p>

                <p className="text-white-600 text-2xl mb-6"> Email: {user.email}</p>

                <p className="text-white-600 text-2xl mb-6"> Premium : {premium ? "Active":"Inactive"} </p>



                <div className={"flex flex-row gap-4"}>
                    <button className="text-white-600 text-2xl mb-6 text-blue-400 underline hover:text-blue-800 transition-colors"> Reset Password </button>

                    <button className="text-white-600 text-2xl mb-6 text-blue-400 underline hover:text-blue-800 transition-colors"> Sign Out </button>


                    {premium && <button className=" text-2xl mb-6  text-blue-400 underline hover:text-blue-800 transition-colors"> Cancel Subscription  </button>}

                </div>
                <button className="text-2xl mt-14 text-red-400 underline hover:text-red-800 transition-colors"> Delete Account </button>




            </div>
        </div>
    )
}