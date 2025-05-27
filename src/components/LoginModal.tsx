import React, { useState } from 'react';
import { X, Github, Facebook, Mail } from 'lucide-react';
import { useStore } from '../store/useStore';
import { FirebaseError } from 'firebase/app';
import { useNavigate } from 'react-router-dom';



const errorMessages: Record<string, string> = {
    "auth/invalid-credential": "No account found with that email.",
    "auth/wrong-password": "Incorrect password.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/too-many-requests": "Too many attempts. Try again later.",
    "auth/weak-password": "Password should be greater than 6 characters.",
    "auth/email-already-in-use": "This email is already in use.",
};

const verifyMessages:JSX.Element[] = [
    <p className="mt-2 text-sm text-red-600">
    Please{' '}
    <button
        type="submit"
        className="font-medium text-purple-600 hover:text-purple-500 underline"
    >
        verify
    </button>{' '}
    your email before trying to login!
    </p>,

    <p className="mt-2 text-sm text-black-600">
     A verification email was sent to your specified email.
    </p>



]

import {
    loginWithEmail,
    loginWithGoogle,
    registerWithEmail,
    resetPassword,
    signOut,
    useAuthListener,
    verifyEmail
} from '../database/firebase.ts'

interface Props {
    isOpen: boolean;
    onClose: () => void;
    setUser: () => void;
}

export default function LoginModal({ isOpen, onClose, setUser }: Props) {
    const [isEmailForm, setIsEmailForm] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const setIsLoggedIn = useStore((state) => state.setIsLoggedIn);

    const [emailError, setEmailError] = useState<[boolean, string]>([false, ""]);


    const [isSignUp, setIsSignUp] = useState(false);
    const [showVerifyMessage, setShowVerifyMessage] = useState<[boolean, number]>([false, 0]);
    const navigate = useNavigate();


    if (!isOpen) return null;

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Email and Pass:', { email, password });


            try {
                if (!isSignUp) {
                    // Log in
                    const cred = await loginWithEmail(email, password);
                    console.log('Logged in user:', cred.user);
                    setEmailError([false, ""]);
                    if (!cred.user.emailVerified) {
                        await verifyEmail(cred.user);
                        setShowVerifyMessage([true, 0]);
                        return;
                    }
                    navigate("/");
                    onClose();


                }else{
                    // might cause error fix soon
                    // Sign up
                    const cred = await registerWithEmail(email, password);

                    console.log('Signed up user:', cred);
                    setIsSignUp(false);
                    await verifyEmail(cred.user);

                    setShowVerifyMessage([true, 1])
                    setEmailError([false, ""]);




                }

            } catch (err) {
                if (err instanceof FirebaseError) {
                    console.log("error code: ", err.code, errorMessages[err.code])
                    setEmailError([true, errorMessages[err.code] ?? "Login Failed"]);
                }else{
                    setEmailError([true, "auth/unknown"]);
                }
                console.error('Login failed:', err);

            }



    };
    const handleGoogleLogin = async () => {
        try {
            loginWithGoogle().then((cred) => {
                console.log('Google Logged in user:', cred);
                // now you can safely call onClose(), set state, etc.
                onClose();
            })



        } catch (err) {
            console.error('Google Login failed:', err);

        }



    };


    if (isEmailForm) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                    <div className="flex justify-between items-center p-6 border-b">

                        <h2 className="text-xl font-semibold text-gray-900">
                            {isSignUp ? 'Sign up':'Sign in'}
                            {' '}with Email
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <form onSubmit={handleEmailSubmit} className="p-6 space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                required
                            />
                        </div>
                        {emailError[0] && (
                            <p className="mt-2 text-sm text-red-600">
                                {emailError[1]}
                            </p>
                        )}
                        { (showVerifyMessage[0] ) && (
                            verifyMessages[showVerifyMessage[1]]
                        )}

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-purple-600 hover:text-purple-500">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                            Sign {isSignUp ? 'Up':'In'}
                        </button>
                        <div className="mt-4 text-center text-sm text-gray-600" >
                            {!isSignUp ? 'Don\'t have an account?': 'Have an account?'}
                            {' '}

                            <button type="button" className="text-purple-600 hover:text-purple-500 font-medium" onClick={() => setIsSignUp(prev => !prev)}>
                                Sign {!isSignUp ? 'Up': 'In'}
                            </button>
                        </div>

                        <div className="mt-4 text-center">
                            <button
                                type="button"
                                onClick={() =>
                                    setIsEmailForm(false)
                            }
                                className="text-sm text-purple-600 hover:text-purple-500"
                            >
                                ← Back to all options
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">Login</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <button
                        className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        onClick={() => setIsEmailForm(true)}
                    >
                        <Mail className="w-5 h-5 text-gray-600" />
                        Continue with Email
                    </button>

                    <button
                        className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        onClick={() => {
                            console.log('Google login');
                           // setIsLoggedIn(true);
                             handleGoogleLogin();


                        }}
                    >
                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                        Continue with Google
                    </button>

                    <button
                        className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        onClick={() => {
                            console.log('Facebook login');
                            setIsLoggedIn(true);

                            onClose();
                        }}
                    >
                        <Facebook className="w-5 h-5 text-blue-600" />
                        Continue with Facebook
                    </button>

                    <button
                        className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        onClick={() => {
                            console.log('GitHub login');
                            setIsLoggedIn(true);
                            onClose();
                        }}
                    >
                        <Github className="w-5 h-5" />
                        Continue with GitHub
                    </button>


                </div>
            </div>
        </div>
    );
}