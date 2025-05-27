import React, {useState, useRef, useEffect, JSX} from 'react';
import { useStore } from "../store/useStore.ts"
import {Plus, X, Tag, Code, Trash, AlignLeft, Undo2} from 'lucide-react';
import CodeBlock from './CodeBlock';






import {Note, Label} from "../data/interfaces.ts";

import NoteModel from "../components/Note.tsx";

import NoteModal from "../components/NoteModal.tsx"


import {getAllNotes, addNoteToUser, updateNote, addLabelToUser, getAllLabels ,DB_deleteLabel,DB_deleteNote} from "../database/database.ts";


interface NoteTakerProps {
    user: user | null;
}


const TIMEOUT_LENGTH = 250;

export default function NoteTaker({user}: NoteTakerProps) {

    const [notes, setNotes] = useState<Note[]>([]);
    const [labels, setLabels] = useState<Label[]>([]);
    const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
    const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);
    const [isAddingLabel, setIsAddingLabel] = useState(false);
    const [newLabelName, setNewLabelName] = useState('');
    const [isLabelsDropdownOpen,setIsLabelsDropdownOpen] = useState(false)
    const [mounted, setMounted] = useState(false);
    const [selectedArea, setSelectedArea] = useState("active");

    const [reload, setReload] = useState(false);


    const indexSelected = useRef<number | null>(null);



    const modalRef = useRef<HTMLDivElement>(null);

    const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);



    useEffect(() => {
        const handle = setTimeout(() => {

            const note = notes.find((note) => note.id === expandedNoteId);
            if (!note) {return}

            updateNote(note.id, {

                title: note.title,
                content: note.content,
                labels: note.labels,
                codeBlocks: note.codeBlocks,
                status: note.status

            });



        }, TIMEOUT_LENGTH);



        // if `body` changes again before 1s, cancel the previous update
        return () => clearTimeout(handle);
    }, [notes]);

    useEffect(() => {
        getAllNotes().then((notes) => {
            setNotes(notes.reverse());

        }).catch((err) => {
            console.error(err);
        })

        getAllLabels().then((labels) => {
            setLabels(labels);
        }).catch((err) => {
            console.error(err);
        })
    }, [user])

    useEffect(() => {

        setMounted(true);
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node) && !(menuRef.current && menuRef.current.contains(event.target as Node))) {

                // if note is empty when closed then delete it
                // console.log(expandedNoteId)
                // if(expandedNoteId){
                //     const expandedNote = notes.filter((note) => note.id == expandedNoteId)[0];
                //     console.log(expandedNote);
                //     if ( (expandedNote.content.length == 1 && expandedNote.content[0].content == "") ||  (expandedNote.content.length == 0 && expandedNote.title == "")){
                //        deleteNote(expandedNote.id);
                //     }
                // }
                setExpandedNoteId(null);

            }
            setMenuPos(null)
            indexSelected.current = null;
        };


        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);


    }, []);








    const handleAreaButton = (area : string) => {
        setSelectedLabels([])
        setSelectedArea((prev) => prev == area ? "active":area)
    }
    const handleMenuDelete = () => {
        if(!indexSelected.current) return;

        setNotes(notes.map((note) => {

            if (note.id !== expandedNoteId) return note;
            const noteContent = note.content;

            noteContent.splice(indexSelected.current, 1);

            return {...note, content: noteContent};

        }))
    }



    const addNote = () => {
        const newNote: Note = {
            id: Date.now().toString(),
            title: '',
            content: [{type: "text", content: ""}, {type:"code", content: ""}],
            labels: [...selectedLabels],
            codeBlocks: [],
            createdAt: new Date(),
            status: "active"
        };
        setNotes([newNote, ...notes]);
        setExpandedNoteId(newNote.id);

        addNoteToUser(newNote);
    };


    const addLabel = () => {
        if (newLabelName.trim()) {
            const newLabel: Label = {
                id: Date.now().toString(),
                name: newLabelName.trim(),
            };
            if (!newLabel) {return;}
            addLabelToUser(newLabel);

            setLabels([...labels, newLabel]);
            setNewLabelName('');
            setIsAddingLabel(false);


        }
    };

    const deleteLabel = (id: string) => {
        const label = labels.find(label => label.id == id);
        DB_deleteLabel(label);
        setLabels(labels.filter(label => label.id !== id));
        setNotes((prev) => prev.map(note => ({
            ...note,
            labels: note.labels.filter(l => l !== id),
        })));

        // loop through all the notes and update them in the database
        for (const note of notes){
            updateNote(note.id, {

                labels: note.labels,


            });
        }
        setSelectedLabels(selectedLabels.filter(l => l !== id));
    };








    const handleNoteClick = (noteId: string) => {
        console.log("NoteId: " + noteId);
        // Put note that was clicked at the front of the list
        const index = notes.findIndex(note => note.id === noteId)
        if (index == -1) return;

        setExpandedNoteId(noteId)

        const copyNotes : Note[] = [...notes];


        copyNotes.splice(0,0, copyNotes.splice(index, 1)[0])

        setNotes(copyNotes)

    }

    let filteredNotes = selectedLabels.length > 0
        ? notes.filter(note =>
            selectedLabels.every(labelId => note.labels.includes(labelId))
        )
        : notes
    // Filter depending on what area
    filteredNotes = filteredNotes.filter(note => note.status == selectedArea)


    return (


        <div className="min-h-screen bg-gray-50 pt-28 p-6">
            {menuPos && (
                <div
                    className="absolute bg-white shadow-md rounded p-2 z-[100]"
                    style={{ top: menuPos.y, left: menuPos.x }}

                    ref={menuRef}
                >
                    {/*<button className="block px-4 py-2 hover:bg-gray-100 w-full text-left">✏️ Edit</button>*/}

                    <button onMouseDown={() => {
                        handleMenuDelete()
                    }}  className="block px-4 py-2 hover:bg-gray-100 w-full text-left">🗑️ Delete</button>
                </div>
            )}
            {/* Sidebar */}
            <div className="fixed left-0 top-28 w-64 h-[calc(100vh-7rem)] bg-white border-r border-gray-200 p-4">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Labels</h2>
                    <div className="space-y-2">
                        <div className="space-y-2">
                            {labels.map(label => (
                                <div
                                    key={label.id}
                                    className="flex items-center justify-between group"
                                >
                                    <Tag className="h-4 w-4 m-1"/>
                                    <button
                                        onClick={() => setSelectedLabels(prev =>
                                            prev.includes(label.id)
                                                ? prev.filter(l => l !== label.id)
                                                : [...prev, label.id]
                                        )}
                                        className={`flex-1 text-left px-3 py-2 rounded-md text-sm ${
                                            selectedLabels.includes(label.id)
                                                ? 'bg-purple-100 text-purple-700'
                                                : 'hover:bg-gray-100'
                                        }`}
                                    >

                                        {label.name}
                                    </button>
                                    <button
                                        onClick={() => deleteLabel(label.id)}
                                        className="hidden group-hover:block p-2 text-gray-400 hover:text-red-500"
                                    >
                                        <Trash className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-2">
                            <div
                                key={"Trash"}
                                className="flex items-center justify-between group"

                            >
                                <Trash className="h-4 w-4 m-1"/>
                                <button
                                    onClick={ () => handleAreaButton("trash") }
                                    className={`flex-1 text-left px-3 py-2 rounded-md text-sm ${
                                        selectedArea == "trash"
                                            ? 'bg-purple-100 text-purple-700'
                                            : 'hover:bg-gray-100'
                                    }`}
                                >

                                    Trash
                                </button>

                            </div>
                        </div>

                    </div>
                    {isAddingLabel ? (
                        <div className="mt-2">
                            <input
                                type="text"
                                value={newLabelName}
                                onChange={(e) => setNewLabelName(e.target.value)}
                                placeholder="Enter label name"
                                className="w-full px-3 py-2 border rounded-md"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') addLabel();
                                    if (e.key === 'Escape') setIsAddingLabel(false);
                                }}
                                autoFocus
                            />
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAddingLabel(true)}
                            className="mt-2 flex items-center text-sm text-purple-600 hover:text-purple-700"
                        >
                            <Plus className="h-6 w-6 mr-1" />
                            Add Label
                        </button>
                    )}
                </div>
            </div>

            {/* Main content */}
            {/*{!mounted && <p className={"absolute top-half left-half"}>Loading Notes...</p> }*/}
            <div className="ml-64 pl-6">
                <button
                    onClick={addNote}

                    className="fixed bottom-4 right-20 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
                >
                    <Plus className="h-6 w-6" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredNotes.map(note => (
                        <div
                            key={note.id}
                            onClick={ () => handleNoteClick(note.id)}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
                        >
                            <input
                                type="text"
                                value={note.title}
                                onChange={(e) => {


                                }

                                }
                                placeholder="Title"
                                className="w-full font-medium mb-2 focus:outline-none text-[1.5rem] "
                                onClick={(e) => e.stopPropagation()}
                            />
                            <div className="text-gray-600 min-h-[20rem] max-h-[20rem] whitespace-pre-line overflow-y-hidden">
                                {note.content.map((cont, i) =>
                                    cont.type === "text" ? (
                                        <div className={"mb-4"}>
                                            <p key={i}>{cont.content}</p>
                                        </div>

                                    ) : (
                                        <div className={"bg-gray-900 text-gray-100 p-4 rounded-md mb-4"}>
                                            <p key={i}>{cont.content == "" ? "Change Code Here!" : cont.content}</p>
                                        </div>
                                    )
                                )}
                            </div>

                            {note.labels.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {note.labels.map(labelId => {
                                        const label = labels.find(l => l.id === labelId);
                                        return label ? (
                                            <span
                                                key={labelId}
                                                className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full"
                                            >
                        {label.name}
                      </span>
                                        ) : null;
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Expanded note modal */}
            {expandedNoteId && (
                <NoteModal modalRef={modalRef} indexSelected={indexSelected} notes={notes} setNotes={setNotes}
                           setIsLabelsDropdownOpen={setIsLabelsDropdownOpen} isLabelsDropdownOpen={isLabelsDropdownOpen} expandedNoteId={expandedNoteId} setExpandedNoteId={setExpandedNoteId} TIMEOUT_LENGTH={TIMEOUT_LENGTH}
                labels={labels} setMenuPos={setMenuPos}/>
            )}
        </div>
    );
}