import { getFirestore, doc, setDoc, updateDoc, getDocs, collection, getDoc, deleteDoc} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import {Note, Label, Message, CustomParam} from "../data/interfaces.ts"
import {useStore} from "../store/useStore.ts";


const db = getFirestore();




// 1) When a user signs up or logs in, create their document if it doesn’t exist:
onAuthStateChanged(getAuth(), async user => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);

    const snap = await getDoc(userRef);

    if (!snap.exists()) {
        await setDoc(
            userRef,
            {
                loggedInCount: 1,
                createdAt: Date.now()
            },
        );
    }else{
        await setDoc(userRef, {
            loggedInCount: snap.data().loggedInCount + 1,
            lastLogAt: Date.now()
        }, { merge: true })
    }

});


export async function addNoteToUser(note: Note) {
    const user = getAuth().currentUser;
    if (!user) throw new Error("Not signed in");

    const noteRef = doc(
        db,
        "users",
        user.uid,
        "notes",
        note.id
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {id: _unused, ...data} = note;
    await setDoc(noteRef, data);
}
export async function addMessageToConversation(newMessages: Message[]) {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error("Must be signed in");

    const convoRef = doc(db, "users", user.uid, "conversation", "default");
    const convoSnap = await getDoc(convoRef);

    if (convoSnap.exists()) {
        await updateDoc(convoRef, {
            messages: newMessages,
            updatedAt: Date.now(),
        });
    } else {
        await setDoc(convoRef, {
            messages: newMessages,
            updatedAt: Date.now(),
        });
    }
}
export async function getConversation() {
    const user = getAuth().currentUser;
    if (!user) {
        throw new Error("Not signed in");
    }

    const convoRef = doc(db, "users", user.uid, "conversation", "default");


    const snapshot = await getDoc(convoRef);


    return snapshot.data();
}

export async function getAllNotes() {
    const user = getAuth().currentUser;
    if (!user) {
        throw new Error("Not signed in");
        return [];
    }

    const notesCol = collection(
        getFirestore(),
        "users",
        user.uid,
        "notes"
    );

    // 2) Read all documents once
    const snapshot = await getDocs(notesCol);

    // 3) Map them into Note objects, pulling in the doc.id
    const notes: Note[] = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Note, "id">)
    }));

    return notes;
}

export async function updateNote(noteId: string,
                                 updates: Partial<Omit<Note, "id">>) {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error("Must be signed in");

    const noteRef = doc(
        db,
        "users",
        user.uid,
        "notes",
        noteId
    );

    // only writes the keys present in `updates`
    await updateDoc(noteRef, updates);

}
export async function updateLabel(labelId: string,
                                 updates: Partial<Omit<Label, "id">>) {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error("Must be signed in");

    const labelRef = doc(
        db,
        "users",
        user.uid,
        "labels",
        labelId
    );

    // only writes the keys present in `updates`
    await updateDoc(labelRef, updates);

}

export async function addLabelToUser(label: Label) {
    const user = getAuth().currentUser;
    if (!user) throw new Error("Not signed in");

    const labelRef = doc(
        db,
        "users",
        user.uid,
        "labels",
        label.id
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {id, ...data} = label;
    await setDoc(labelRef, data);


}
export async function getAllLabels(){
    const user = getAuth().currentUser;
    if (!user) {
        throw new Error("Not signed in");
    }

    const labelsCol = collection(
        getFirestore(),
        "users",
        user.uid,
        "labels"
    );

    // 2) Read all documents once
    const snapshot = await getDocs(labelsCol);

    // 3) Map them into Note objects, pulling in the doc.id
    const labels: Label[] = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Label, "id">)
    }));

    return labels;



}


export async function DB_deleteLabel(label: Label) {

    const user = getAuth().currentUser;
    if (!user) {
        throw new Error("Not signed in");
    }

    const labelRef = doc(db, "users", user.uid, "labels", label.id);


    await deleteDoc(labelRef);

}
export async function DB_deleteNote(noteId: string) {
    const user = getAuth().currentUser;
    if (!user) {
        throw new Error("Not signed in");
    }

    const noteRef = doc(db, "users", user.uid, "notes", noteId);


    await deleteDoc(noteRef);
}


const setCustomParamsChanged =  useStore.getState().setCustomParamsChanged;
let customParams = useStore.getState().customParams;
export async function updateCustomParam(customParamId : string, updates: Partial<CustomParam>) {
    const user = getAuth().currentUser;
    if (!user) {
        throw new Error("Not signed in");
    }

    setCustomParamsChanged(true);

    const paramRef = doc(db, "users", user.uid, "custom_parameters", customParamId );

    await updateDoc(paramRef, updates);
}
export async function addCustomParam(customParam : CustomParam){
    const user = getAuth().currentUser;
    if (!user) {
        throw new Error("Not signed in");
    }
    setCustomParamsChanged(true);
    console.log("id: ", customParam.id);
    const paramRef = doc(db, "users", user.uid, "custom_parameters", customParam.id);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {id, ...data} = customParam;
    await setDoc(paramRef, data);
}
export async function deleteCustomParam(customParamId : string){
    const user = getAuth().currentUser;
    if (!user) {
        throw new Error("Not signed in");
    }

    const paramRef = doc(db, "users", user.uid, "custom_parameters",customParamId);

    await deleteDoc(paramRef);
}
export async function getCustomParams(){
    const user = getAuth().currentUser;
    if (!user) {
        throw new Error("Not signed in");
    }

    const paramRef = collection(db, "users", user.uid, "custom_parameters");
    const snapshot = await getDocs(paramRef);

    customParams = useStore.getState().customParams;
    if(customParams && customParams.length != 0 && !useStore.getState().customParamsChanged) {
        return customParams;
    }
    useStore.setState({customParams: snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        } as CustomParam))});

    setCustomParamsChanged(false);

    return useStore.getState().customParams;

}

export async function getSubscription(){
    const user = getAuth().currentUser;
    if(!user) throw new Error("Not signed in");

    const docRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
        const data = snapshot.data();

        console.log("Subscription: ", data.subscription)
        return data.subscription
    }
    return null;

}



export async function getPremiumContent(content: Record<string, string>) {
    const user = getAuth().currentUser;
    if(!user) throw new Error("Not signed in");

    const token = await user.getIdToken();

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/premium/certifications`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ content: content }),
    });
    const json = await res.json();
    if(!res.ok){

        console.error("Error while retrieving premium content: ", json.error);
       throw new Error(json.error.message);
    }else{
        return json;

    }
}


export async function isPremium() {

    const user = getAuth().currentUser;
    if(!user) throw new Error("Not signed in");

    const token = await user.getIdToken();

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/premium/is_premium`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
    const json = await res.json();
    if(!res.ok){

        throw new Error(json.error.message);
    }else{

        return json.premium;

    }
}
