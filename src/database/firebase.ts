// src/firebase.ts
import { initializeApp } from 'firebase/app'
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";


import  React  from 'react'
import {
    getAuth,
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithPopup,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    deleteUser,
    reauthenticateWithPopup,


    type User
} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyBb63GSckcHYTODRyuT5Wjja1lJNmKUV0I",
    authDomain: "pwnprep.firebaseapp.com",
    projectId: "pwnprep",
    storageBucket: "pwnprep.firebasestorage.app",
    messagingSenderId: "918530872416",
    appId: "1:918530872416:web:5646077d087295e8405f05",
    measurementId: "G-BFZ4TDWV8E"
}
const app = initializeApp(firebaseConfig)


initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_SITE_KEY),
    isTokenAutoRefreshEnabled: true,
});

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const facebookProvider = new FacebookAuthProvider()

async function handle_login() {
    const user = auth.currentUser;
    if(!user) throw new Error("Not signed in");

    const token = await user.getIdToken();

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user_login`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },

    });
    const json = await res.json();
    if(!res.ok){
        console.error("Error while handling login: ", json.error);
        throw new Error("Login failed");
    }
}


export async function cancel_subscription() {
    const user = auth.currentUser;
    if(!user) return;

    const token = await user.getIdToken();

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cancel_subscription`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },

    });
    const json = await res.json();
    if(!res.ok){
        console.log(json.error)
        console.error("Error while handling Cancel Subscription: ", json.error);
        throw new Error("Cancel Subscription Failed");
    }
    return json;
}

async function handle_delete() {
    const user = auth.currentUser;
    if(!user) return;


    const token = await user.getIdToken();

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user_delete`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },

    });
    const json = await res.json();
    if(!res.ok){
        console.error("Error while handling User Delete: ", json.error);
        throw new Error("Delete User failed");
    }
}



// 2) Sign-up / Sign-in helpers
// export function registerWithEmail(email: string, pw: string) {
//     handle_login()
//     return createUserWithEmailAndPassword(auth, email, pw)
//
// }
// export async function loginWithEmail(email: string, pw: string) {
//
//     await signInWithEmailAndPassword(auth, email, pw)
//     await handle_login()
//     await auth.currentUser?.getIdToken(true);
//
// }
export async function login(authProvider: "google" | "facebook" | "github"){
    if (authProvider == "google"){
        await loginWithGoogle();
    }

    await handle_login()
    await auth.currentUser?.getIdToken(true);


}

export async function delete_user(authProvider: "google" | "facebook" | "github"){
    const user = auth.currentUser
    if (!user) throw new Error("Not signed in");
    await handle_delete()

    if(authProvider == "google"){
        await reauthenticateWithPopup(user, googleProvider);
        await deleteUser(user);
    }
}
async function loginWithGoogle() {
    await signInWithPopup(auth, googleProvider)
}
// async function loginWithFacebook() {
//     await signInWithPopup(auth, facebookProvider)
// }
// async function loginWithGithub() {
//     await signInWithPopup(auth, facebookProvider)
// }
// export function resetPassword(email: string) {
//     return sendPasswordResetEmail(auth, email)
// }
export function signOut() {
    return firebaseSignOut(auth)
}
// export function verifyEmail(user: User | null) {
//     if (!user) throw new Error('No user provided to verifyEmail');
//     return sendEmailVerification(user);
// }

// 3) Hook to subscribe to auth state
export function useAuthListener(onChange: (user: User | null) => void) {
    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, onChange)
        return unsubscribe
    }, [onChange])

}
