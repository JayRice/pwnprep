import React, {useEffect} from 'react';

import {Note, Label} from "../data/interfaces.ts"

interface Props{
    note: Note | null;
    labels: Label[];
    handleNoteClick: (noteId : string) => void;
}



export default function NoteModel({note, labels, handleNoteClick}: Props){

    useEffect(() => {
        console.log(note);
    }, [])

    return (

        <div></div>
    )
}