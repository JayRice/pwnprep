import React, {useState, useRef, useEffect, JSX} from 'react';
import { useStore } from "../store/useStore.ts"
import {Plus, X, Tag, Code, Trash, AlignLeft, Undo2} from 'lucide-react';
import CodeBlock from './CodeBlock';


import {Note, Label} from "../data/interfaces.ts"


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

    const {targetParams} = useStore();

    const modalRef = useRef<HTMLDivElement>(null);

    const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleContextMenu = (e: React.MouseEvent, index: number) => {
        e.preventDefault(); // disable default right-click
        setMenuPos({ x: e.pageX, y: e.pageY });
        indexSelected.current = index;
    };


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





    const replaceParams = (command: string) => {
        return command
            .replace(/\[IP\]/g, targetParams.ip || '[IP]')
            .replace(/\[PORT\]/g, targetParams.port || '[PORT]')
            .replace(/\[SERVICE\]/g, targetParams.service || '[SERVICE]');
    };
    const revertParams = (command: string) => {

        const parameterLookup: Record<string, string> = {'ip': '[IP]', 'port': '[PORT]', 'service': '[SERVICE]'};

        // backslash all special characters from the parameters to ensure safe regex
        for (const key in targetParams){

            const safeParameter = targetParams[key].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            if (!safeParameter) continue;
            command = command.replace(new RegExp(safeParameter, "g"), parameterLookup[key] || safeParameter);
        }
        return command

    };
    const handleReactivateClick = (noteId: string) => {
        setNotes(notes.map((note) => {
            if (note.id !== noteId) return note;
            note.status = "active";

            return {...note, status: note.status};

        }));


        if (expandedNoteId === noteId) {
            setExpandedNoteId(null);
        }
    }

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

    const handleTagClick = () => {
        setIsLabelsDropdownOpen(prevState => !prevState);
    }

    const handleCodeClick = () => {
        // Add code block
        addNoteContent(expandedNoteId, "", "code");
        // Add textarea under code block
    }
    const handleTextClick = () => {
        addNoteContent(expandedNoteId, "", "text");
    }
    const handleAddNoteLabel = (labelId: string) => {

        setNotes(prev =>
            prev.map(n =>
                n.id === expandedNoteId
                    ? {
                        ...n,
                        labels: n.labels.includes(labelId)
                            ? n.labels.filter(id => id !== labelId)  // remove
                            : [...n.labels, labelId]                  // add
                    }
                    : n
            )
        );
    };
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

    const deleteNote = (id: string) => {
        // Move note to delete status area
        console.log("Before:", notes);

        // This creates a **completely new array**, immutably
        const updatedNotes = notes.map((note) =>
            note.id === id ? { ...note, status: "trash" } : note
        );

        setNotes(updatedNotes);




    setTimeout(() => {
        if (expandedNoteId === id) {
            setExpandedNoteId(null);
        }
    }, TIMEOUT_LENGTH)

    };
    const permetatelyDeleteNote = (noteId : string) => {
        DB_deleteNote(noteId);

        setNotes((prev) => [...prev.filter((note) => note.id !== noteId)]);

        if (expandedNoteId === noteId) {
            setExpandedNoteId(null);
        }
    }



    const updateNoteInLine = (noteId: string, updates: Partial<Note>) => {
        setNotes((prev) => prev.map(note =>
            note.id === noteId ? { ...note, ...updates } : note
        ));
    };
    const addNoteContent = (noteId: string, textBlock: string, type: string) => {
        // adds a text block to the content list so that textareas and codeblocks can be seperated
        setNotes((prev) => prev.map(note => {
                if (note.id === noteId) {
                    note.content.push({type: type, content: textBlock});
                }
                return note;
            }
        ));
    };

    const updateNoteContent = (noteId: string, contentIndex: number, content: string) => {
        // updates content to the actual textareas and codeblocks
        setNotes((prev) => prev.map(note => {
                if (note.id === noteId) {
                    const cont = note.content[contentIndex];

                    note.content[contentIndex].content = content;
                }
               return note;
            }
        ));
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




    const noteLabels = labels.map(label => {
        // grab the expanded note (or undefined if none)
        const note = notes.find(n => n.id === expandedNoteId);

        if (!note) return label;

        // true if that note has this label
        const isSelected = note?.labels.includes(label.id) ?? false;

        // only inject the classes when selected
        const selectedClasses = isSelected
            ? " bg-purple-100 text-purple-700"
            : "";

        return (
            <button
                key={label.id}
                onClick={() => handleAddNoteLabel(label.id)}
                className={
                    "flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                    + selectedClasses
                }
            >
                <Plus className="h-4 w-4 mr-2" />
                {label.name}
            </button>
        );
    });

    const deleteCodeBlock = (index: number) =>{

        setNotes((prev) => prev.map((note) => {

            const noteContent = [...note.content];

            if (note.id != expandedNoteId){return note}

            noteContent.splice(index,1);

            // refactor text blocks
            // for (let i = 0; i < note.content.length; i++) {
            //     if (i <= 0) {continue;}
            //     // Combine both text to avoid repitition
            //     if (noteContent[i-1].type == "text" && noteContent[i].type == "text"){
            //         noteContent[i-1].content += "\n" + noteContent[i].content;
            //         noteContent.splice(i, 1);
            //         i--;
            //     }
            //
            // }
            return {...note, content: noteContent};
        }))
    }
    const updateCodeContent = (codeBlockId: string, content: string) =>{
        setNotes((prev) => prev.map((note) => {
            if (note.id == expandedNoteId){
                note.content[codeBlockId].content = revertParams(content);
            }
            return note;
        }))

    }
    const parseNoteContent = (noteId: string, content: string[]) =>{

        let jsx : JSX.Element[] = [];


        for (let i = 0; i<content.length; i++){
            // textarea every even
            if (content[i].type == "text"){
                jsx.push(

                    <textarea key={i} value={content[i].content} maxLength={50000}
                                   ref={((el) => {
                                       if(!el) return;
                                       el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px';

                                   })}
                                    onContextMenu={(e) => handleContextMenu(e, i)}
                                  onChange={(e) => {
                                      updateNoteContent(noteId, i, e.target.value);
                                      // updateNoteInLine(expandedNote, { content: e.target.value })
                                      e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px';
                                  }}


                                  placeholder="Take a note..."
                                  className="w-full  resize-none focus:outline-none overflow-hidden relative group "
                    />

                        );
            }
            // codeblock every odd
            else if (content[i].type == "code"){
                jsx.push(<CodeBlock id={i}  onContextMenu={(e) => handleContextMenu(e, i)} interactive={true} refactoredCode={replaceParams(content[i].content)} code={content[i].content} deleteCodeBlock={deleteCodeBlock} className={"mb-4"}  updateCodeContent={updateCodeContent}/>);
            }
        }
        return (jsx);
    }

    const handleNoteClick = (noteId: string) => {
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div
                        ref={modalRef}
                        className="bg-white rounded-lg shadow-xl w-full max-w-2xl"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <input
                                    type="text"
                                    value={notes.find(n => n.id === expandedNoteId)?.title || ''}
                                    onChange={(e) => {
                                        updateNoteInLine(expandedNoteId, { title: e.target.value })
                                    }
                                }
                                    placeholder="Title"
                                    className="text-xl font-medium focus:outline-none"
                                />
                                <button
                                    onClick={() => setExpandedNoteId(null)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className={"h-80 overflow-y-scroll"}>
                                {
                                    parseNoteContent(expandedNoteId, notes.find(n => n.id === expandedNoteId).content)
                                }


                            </div>
                            <div className="flex items-end gap-2 mt-4">
                                <div className="relative">
                                    <button
                                        onClick={() => {
                                            handleTagClick()

                                        }}
                                        className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                                    >
                                        <Tag className="h-5 w-5" />
                                    </button>

                                    {isLabelsDropdownOpen &&
                                        (<div className="absolute  mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200 p-1 max-h-[8rem] overflow-y-scroll">
                                            {noteLabels}


                                        </div>)

                                    }
                                </div>

                                <button
                                    onClick={() => { handleCodeClick() } }
                                    className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                                >
                                    <Code className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => { handleTextClick() } }
                                    className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                                >
                                    <AlignLeft className="h-5 w-5" />
                                </button>
                                <div className="flex-1" />

                                <button
                                    onClick={() => {
                                        const note = notes.filter(n => n.id === expandedNoteId)[0];


                                        // permetately delete
                                        if (note.status == "trash"){
                                            permetatelyDeleteNote(expandedNoteId)
                                            return;
                                        }
                                        deleteNote(expandedNoteId)
                                    }
                                    }
                                    className="p-2 text-red-500 hover:text-red-600 rounded-full hover:bg-red-50"
                                    title={notes.filter(n => n.id === expandedNoteId)[0].status=="trash" ? "Permenately Delete":"Delete"}
                                >
                                    <Trash className="h-4 w-4" />
                                </button>
                                {notes.filter(n => n.id === expandedNoteId)[0].status == "trash" &&
                                <button
                                    onClick={() => {
                                        handleReactivateClick(expandedNoteId)
                                    }}
                                    className="p-2 text-purple-500 hover:text-purple-600 rounded-full hover:bg-purple-50"
                                    title={"Undo Trash"}
                                >
                                    <Undo2 className="h-4 w-4" />
                                </button>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}