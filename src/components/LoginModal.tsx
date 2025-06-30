import {useState} from "react";

import { X} from 'lucide-react';

import {toast, Toaster} from "react-hot-toast"

import LoadingSpinner from "./LoadingSpinner.tsx"

//
//
// const errorMessages: Record<string, string> = {
//     "auth/invalid-credential": "No account found with that email.",
//     "auth/wrong-password": "Incorrect password.",
//     "auth/invalid-email": "Please enter a valid email address.",
//     "auth/too-many-requests": "Too many attempts. Try again later.",
//     "auth/weak-password": "Password should be greater than 6 characters.",
//     "auth/email-already-in-use": "This email is already in use.",
// };
//
// const verifyMessages:JSX.Element[] = [
//     <p className="mt-2 text-sm text-red-600">
//     Please{' '}
//     <button
//         type="submit"
//         className="font-medium text-purple-600 hover:text-purple-500 underline"
//     >
//         verify
//     </button>{' '}
//     your email before trying to login!
//     </p>,
//
//     <p className="mt-2 text-sm text-black-600">
//      A verification email was sent to your specified email.
//     </p>
//
//
//
// ]

import {
    login,
} from '../database/firebase.ts'

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: Props) {


    const [isLoggingIn, setIsLoggingIn] =  useState(false);


    if (!isOpen) return null;


    const handleSuccessfulLogin = () => {
        toast("Successfully logged in! Welcome to PwnPrep.")
    }

    const handleLogin = async (authProvider: "google" | "github" | "facebook") => {
        setIsLoggingIn(true)
        try {
            login(authProvider).then(() => {
                handleSuccessfulLogin();
                setIsLoggingIn(false)
                onClose();
            })



        } catch (err) {
            setIsLoggingIn(false)
            toast('Login failed: Try again later');
            console.error(err);

        }
    };







    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Toaster position={"top-center"}></Toaster>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">Login</h2>
                    { !isLoggingIn ? <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <X className="h-6 w-6" />
                    </button> : <LoadingSpinner parentClassName={""} spinnerClassName={""}/>}
                </div>

                <div className="p-6 space-y-4 p-8">


                    <button
                        className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        disabled={isLoggingIn}
                        onClick={() => {
                            handleLogin("google");
                        }}
                    >
                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                        Continue with Google
                    </button>




                </div>
            </div>
        </div>
    );
}