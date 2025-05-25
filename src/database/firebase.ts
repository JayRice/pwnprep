// src/firebase.ts
import { initializeApp } from 'firebase/app'
import { getAnalytics } from "firebase/analytics";
import  React  from 'react'
import {
    getAuth,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    createUserWithEmailAndPassword,
    sendEmailVerification,
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
const analytics = getAnalytics(app);

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

// 2) Sign-up / Sign-in helpers
export function registerWithEmail(email: string, pw: string) {
    return createUserWithEmailAndPassword(auth, email, pw)
}
export function loginWithEmail(email: string, pw: string) {
    return signInWithEmailAndPassword(auth, email, pw)
}
export function loginWithGoogle() {
    return signInWithPopup(auth, googleProvider)
}
export function resetPassword(email: string) {
    return sendPasswordResetEmail(auth, email)
}
export function signOut() {
    return firebaseSignOut(auth)
}
export function verifyEmail(user: User | null) {
    if (!user) throw new Error('No user provided to verifyEmail');
    return sendEmailVerification(user);
}

// 3) Hook to subscribe to auth state
export function useAuthListener(onChange: (user: User | null) => void) {
    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, onChange)
        return unsubscribe
    }, [onChange])
}