import {useStore} from "../store/useStore.ts"
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Link} from "react-router-dom";
import {delete_user, cancel_subscription} from "../database/firebase.ts"
import {toast, Toaster} from "react-hot-toast";

import ConfirmationModal from "./ConfirmationModal.tsx"



interface Props {
    user:import('firebase/auth').User | null;
}
export default function ProfilePage({user} : Props) {
    const premium = useStore((state) => state.isPremium);

    const navigate = useNavigate();


    const [isDeletingUser, setIsDeletingUser] = useState(false);
    const [isCancelingSubscription, setIsCancelingSubscription] = useState(false);
    if (!user) {

        return (
            <Link to={"/"} >No User Logged In, Go back home.</Link>
        )
    }
    /*
    * providerData : [{"providerId":"google.com","uid":"102870588615729799220","displayName":"Jayden R","email":"jayjrice1@gmail.com","phoneNumber":null,"photoURL":"https://lh3.googleusercontent.com/a/ACg8ocKJYNVzZnwVkGp4B8AhBv71gwN46WShy5BftH7Lq2KCaCHDyg=s96-c"}]
    * */
    return (
        <div className={"flex justify-center w-full h-full break-words"}>
            <Toaster position={"bottom-right"}></Toaster>

            {isDeletingUser &&
                <ConfirmationModal confirming_reason={"Delete User"} cancel_callback={() => setIsDeletingUser(false)} confirm_callback={ async () => {
                    try{
                        await delete_user("google")
                        toast("Successfully Deleted User")
                        navigate("/")

                    }catch(error){

                        setIsDeletingUser(false)
                        toast("Something went wrong, try again later! " + error)
                    }

                }}/>
            }

            {isCancelingSubscription &&
                <ConfirmationModal confirming_reason={"End Your Subscription"} description={"Your premium features will be disabled at the end of your billing period."} cancel_callback={() => setIsCancelingSubscription(false)} confirm_callback={ async () => {
                try{
                    await cancel_subscription();
                    toast("Successfully Cancelled Subscription, Come Back Soon!")
                    navigate("/")
                }catch(error){
                    setIsCancelingSubscription(false);
                    toast("Something went wrong, try again later! " + error)
                }

            }}/>}

            <div className=" w-[40vw] h-full min-h-[70vh] rounded-lg border-4 border-gray-600 text-gray-600 mt-12 text-black p-4">

                <h1 className={"font-bold text-3xl mt-4 text-center mb-6"}> Profile </h1>

                <p className=" text-2xl mb-6"> User Id: {user.uid}</p>

                <p className="text-2xl mb-6"> Email: {user.email}</p>

                <p className="text-2xl mb-6"> Premium : {premium ? "Active":"Inactive"} </p>



                <div className={"flex flex-col justify-center items-center gap-4 bottom-2 mt-12"}>



                    {premium && <button onClick={() => {
                        setIsCancelingSubscription(true)
                    }} className=" font-bold text-2xl   text-red-600 underline hover:text-red-800 transition-colors"> Cancel Subscription </button>}

                    <button onClick={() => {
                        setIsDeletingUser(true);
                    }} className="font-bold text-2xl  text-red-600 underline hover:text-red-800 transition-colors"> Delete Account </button>

                </div>




            </div>
        </div>
    )
}