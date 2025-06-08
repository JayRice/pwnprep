import  {useState, useRef, useEffect} from 'react';
import {Plus, Trash , Check, Archive, ChevronDown, ChevronUp } from 'lucide-react';






import {Note, Label} from "../data/interfaces.ts";


import NoteModal from "../components/NoteModal.tsx"


import {getAllNotes, addNoteToUser, updateNote, addLabelToUser, updateLabel, getAllLabels ,DB_deleteLabel,DB_deleteNote} from "../database/database.ts";
import ToggleButton from "./ToggleButton.tsx";


interface NoteTakerProps {
    user: import('firebase/auth').User | null;
    actionBarToggled: boolean;
}


const TIMEOUT_LENGTH = 250;



export default function NoteTaker({user, actionBarToggled}: NoteTakerProps) {

    const [notes, setNotes] = useState<Note[]>([]);
    const [labels, setLabels] = useState<Label[]>([]);
    const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
    const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
    const [editedNotes, setEditedNotes] = useState<string[]>([]);

    const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);
    const [isAddingLabel, setIsAddingLabel] = useState(false);
    const [newLabelName, setNewLabelName] = useState('');



    const [newChildLabelId, setNewChildLabelId] = useState("");
    const [newChildLabel, setNewChildLabel] = useState('');


    const [isLabelsDropdownOpen,setIsLabelsDropdownOpen] = useState(false)
    const [selectedArea, setSelectedArea] = useState("active");



    const indexSelected = useRef<number>(0);


    const [isAllSelected, setIsAllSelected] = useState(false);



    const modalRef = useRef<HTMLDivElement>(null);

    const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const [isHovered, setIsHovered] = useState<string | null>(null);

    const expandedNote = notes.find((note) => note.id === expandedNoteId);

    const reorderedLabelsRef = useRef<string[]>([]);

    const [collapsedLabels, setCollapsedLabels] = useState<string[]>([]);

    const [searchValue, setSearchValue] = useState("");

    const [labelsBarToggled, setLabelsBarToggled] = useState<boolean>(false);




    useEffect(() => {
        const handle = setTimeout(() => {

            if (selectedNotes.length > 0 || editedNotes.length > 0) {
                for (const noteId of selectedNotes){
                    const note = notes.find((note) => noteId === note.id);
                    if (!note) continue;
                    updateNote(note.id, {

                        title: note.title,
                        content: note.content,
                        labels: note.labels,
                        status: note.status

                    });
                }
                for (const noteId of editedNotes){
                    const note = notes.find((note) => noteId === note.id);
                    if (!note) continue;
                    updateNote(note.id, {

                        title: note.title,
                        content: note.content,
                        labels: note.labels,
                        status: note.status

                    });
                }
                setSelectedNotes([])
                setEditedNotes([])


            }
            if (!expandedNote) {return}

            updateNote(expandedNote.id, {

                title: expandedNote.title,
                content: expandedNote.content,
                labels: expandedNote.labels,
                status: expandedNote.status

            });



        }, TIMEOUT_LENGTH);



        // if `body` changes again before 1s, cancel the previous update
        return () => clearTimeout(handle);
    }, [notes]);

    useEffect(() => {
        for (const label of labels){

            updateLabel(label.id, {

                name: label.name,
                childLabels: label.childLabels

            })
        }
    }, [labels]);

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

        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node) && !(menuRef.current && menuRef.current.contains(event.target as Node))) {

                // if note is empty when closed then delete it

                // get the first note in the list because whenever you click a note it moves it to the front
                // if(notes.length < 0) {return}
                // const lastExpandedNote = notes[0];
                //
                // if ( (lastExpandedNote.content.length == 1 && lastExpandedNote.content[0].content == "") ||  (lastExpandedNote.content.length == 0 && lastExpandedNote.title == "")){
                //     permetatelyDeleteNote(lastExpandedNote.id);
                // }
                setExpandedNoteId(null);

            }
            setMenuPos(null)
            indexSelected.current = -1;
        };


        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);


    }, []);








    const handleAreaButton = (area : string) => {
        setSelectedLabels([])
        setSelectedArea((prev) => prev == area ? "active":area)
    }
    const handleMenuDelete = () => {

        if(indexSelected.current == null) return;
        setNotes(notes.map((note) => {

            if (note.id !== expandedNoteId) return note;
            const noteContent = note.content;

            noteContent.splice(indexSelected.current as number, 1);

            return {...note, content: noteContent};

        }))
    }
    const addNote = () => {
        const newNote: Note = {
            id: Date.now().toString(),
            title: '',
            content: [{type: "text", content: ""}, {type:"code", content: ""}],
            labels: [...new Set(selectedLabels)],
            createdAt: new Date(),
            status: "active"
        };
        console.log("Note: ", ...selectedLabels)
        setNotes([newNote, ...notes]);
        setExpandedNoteId(newNote.id);

        addNoteToUser(newNote);
    };
    const addLabel = () => {
        if (newLabelName.trim()) {
            const newLabel: Label = {
                id: Date.now().toString(),
                name: newLabelName.trim(),
                parentLabel: null,
                childLabels: [],
                depth: 0

            };
            if (!newLabel) {return;}
            addLabelToUser(newLabel);

            setLabels([...labels, newLabel]);
            setNewLabelName('');
            setIsAddingLabel(false);


        }
    };
    const addChildLabel = (parentId: string) => {
        if (newChildLabel.trim()) {
            const parentLabel = labels.find((label) => label.id === parentId);
            if(!parentLabel) return;
            const newLabel: Label = {
                id: Date.now().toString(),
                name: newChildLabel.trim(),
                parentLabel: parentId,
                childLabels: [],
                depth: parentLabel.depth+1
            };

            if (!newLabel) {return;}
            addLabelToUser(newLabel);

            // Add new label
            setLabels((prev) => {
                const updated = prev.map((label) => {
                    if (label.id === parentId) {
                        return {
                            ...label,
                            childLabels: [...label.childLabels, newLabel.id], // ✅ new array
                        };
                    }
                    return label;
                });

                return [...updated, newLabel]; // ✅ also adds the new label
            });

            setNewChildLabel("");
            setNewChildLabelId("");


        }
    };


    const deleteLabel = (id: string) => {
        const label = labels.find(label => label.id == id);
        if (!label) {return}
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
        // Put note that was clicked at the front of the list
        const index = notes.findIndex(note => note.id === noteId)
        if (index == -1) return;

        setExpandedNoteId(noteId)

        const copyNotes : Note[] = [...notes];


        copyNotes.splice(0,0, copyNotes.splice(index, 1)[0])

        setNotes(copyNotes)

    }
    const changeStatusOfNote = (id: string ,status: string) => {
        // Move note to delete status area



        setNotes((prev) => prev.map((note) => {
            return note.id === id ? { ...note, status: status } : note
        }));




        setTimeout(() => {
            if (expandedNoteId === id) {
                setExpandedNoteId(null);
            }
        }, TIMEOUT_LENGTH)

    };
    const changeStatusOfManyNotes = (noteIds: string[], status: string) => {

        setNotes((prev) => prev.map((note) => {
            return noteIds.includes(note.id)  ? { ...note, status: status } : note
        }));

    }
    const permetatelyDeleteNote = (noteId : string) => {
        DB_deleteNote(noteId);

        setNotes((prev) => [...prev.filter((note) => note.id !== noteId)]);

        if (expandedNoteId === noteId) {
            setExpandedNoteId(null);
        }
    }
    const permetatelyDeleteManyNotes = (noteIds: string[]) => {
        for (const noteId of noteIds) {
            DB_deleteNote(noteId);
        }

        setNotes((prev) => [...prev.filter((note) => !noteIds.includes(note.id))])
    }

    function swap<T>(arr: T[], i: number, j: number): void {
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    const swapNoteContent = (from: number, to: number ) => {

        if (to < 0 || !expandedNote || to >= expandedNote.content.length   ){
            console.log("RETURNINGNGNGNG")
            return;
        }
        console.log(from,to)
        setNotes(notes.map((note) => {
            if ( note.id == expandedNoteId ){
                swap(note.content, from, to);
            }
            return note;
        }));
    }


    const recursivelyOrderLabels = ( labelIds: string[], depth: number) => {
        for (const labelId of labelIds) {
            const label = labels.find((label) => label.id === labelId);
            if(!label) continue;
            if (label.depth == depth){
                reorderedLabelsRef.current.push(label.id)
                if (label.childLabels.length > 0 && !collapsedLabels.includes(label.id)) {
                    recursivelyOrderLabels( label.childLabels, label.depth+1);
                }
            }
        }
    }
    let filteredNotes = selectedLabels.length > 0
        ? notes.filter(note =>
            selectedLabels.every(labelId => note.labels.includes(labelId))
        )
        : notes
    // Filter depending on what area
    filteredNotes = filteredNotes.filter(note => note.status == selectedArea)

    if(searchValue != "") {
        filteredNotes = filteredNotes.filter((note) => {
            // find the search value in the title or anywhere inside
            return note.title.includes(searchValue) ||
                note.content.filter((content) => content.content.includes(searchValue)).length > 0
        });
    }
    function handleToggleLogic(bothToggled: string, actionToggled: string, labelToggled: string, noneToggled: string){
        return actionBarToggled && labelsBarToggled ? bothToggled: actionBarToggled ? actionToggled: labelsBarToggled ? labelToggled:noneToggled
    }


    reorderedLabelsRef.current = []
    recursivelyOrderLabels(labels.map((label) => label.id), 0)

    const reorderedLabels : Label[]  = reorderedLabelsRef.current.map((labelId) =>
        labels.find((label) => label.id == labelId)
    ).filter((label) => label !== undefined)


    return (


        <div className="min-h-screen bg-gray-50 pt-28 p-6">
            <ToggleButton isToggled={labelsBarToggled} setIsToggled={setLabelsBarToggled} className={
                handleToggleLogic("left-4", "left-64 ml-[-1rem]","left-16", "left-64 ml-[3rem]") + " z-[36]"
            }></ToggleButton>

            {selectedNotes.length > 0 && (
                <div id={"selected-note-dropdown"} className={"fixed w-full h-16 bg-gray-900 top-[12%] z-[24] mt-2 flex flex-row justify-end gap-10 pr-16 items-center"}>
                    <button title={selectedArea == "trash" ? "Permenately Delete All":"Trash All"} className={"text-white  bg-gray-800 rounded-full p-2"}
                    onClick={() => {
                        if (selectedArea == "trash"){
                            return permetatelyDeleteManyNotes(selectedNotes);
                        }
                        changeStatusOfManyNotes(selectedNotes, "trash")

                    }}>
                        <Trash className={"w-6 h-6"}></Trash>
                    </button>
                    <button title={"Archive All"} className={"text-white bg-gray-800 rounded-full p-2"}
                            onClick={() => {
                                changeStatusOfManyNotes(selectedNotes, "archive")


                            }}>
                        <Archive className={"w-6 h-6"}></Archive>
                    </button>

                    <button title={isAllSelected ? "Unselect All":"Select All"} className={"text-white bg-purple-600 rounded-md p-4"}
                            onClick={() => {
                                setIsAllSelected((prev) => !prev);

                                if(!isAllSelected) {
                                   return setSelectedNotes(notes.filter((note) => {
                                        return note.status == selectedArea
                                    }).map((note) => note.id));
                                }
                                setSelectedNotes([])

                                

                            }}>
                        {isAllSelected ? "Unselect All":"Select All"}
                    </button>




                </div>
            )}

            {menuPos && (
                <div
                    className="absolute bg-white shadow-md rounded p-2 z-[100]"
                    style={{ top: menuPos.y, left: menuPos.x }}

                    ref={menuRef}
                >
                    {/*<button className="block px-4 py-2 hover:bg-gray-100 w-full text-left">✏️ Edit</button>*/}
                    <button onMouseDown={() => {
                        if (indexSelected.current == null) return;
                        swapNoteContent(indexSelected.current, indexSelected.current-1)
                    }}  className="flex flex-row gap-2 px px-4 py-2 hover:bg-gray-100 w-full text-left"><ChevronUp/>Move Up</button>
                    <button onMouseDown={() => {
                        if (indexSelected.current == null) return;
                        swapNoteContent(indexSelected.current, indexSelected.current+1)
                    }}  className="flex flex-row gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left"><ChevronDown/>Move Down</button>

                    <button onMouseDown={() => {
                        console.log(indexSelected.current)
                        handleMenuDelete()
                    }}  className="flex flex-row gap-2 px px-4 py-2 hover:bg-gray-100 w-full text-left">🗑️ Delete</button>
                </div>
            )}

            {/* Sidebar */}
            <div className={`fixed ${handleToggleLogic("left-[-16rem]", "left-0", "left-[-16rem]", "left-16")} top-28 w-64 h-[calc(100vh-7rem)] bg-white border-r border-gray-200 p-4 z-[35] position-add position-transition`}>
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Labels</h2>
                    <div className="space-y-2">
                        <div className="space-y-2">
                            {reorderedLabels.map(label => (
                                <div
                                    key={label.id}
                                    className={`flex items-center justify-between group relative depth-${label.depth}`}
                                >
                                    {label.childLabels.length > 0 &&
                                        <button onClick={() => {
                                            if (collapsedLabels.includes(label.id)) {
                                                return setCollapsedLabels(prev => prev.filter((labelId) => labelId !== label.id) )
                                            }
                                            setCollapsedLabels(prev => [...prev, label.id])
                                        }}>
                                            {!collapsedLabels.includes(label.id) ? <ChevronDown className="h-4 w-4 m-1"/>: <ChevronUp className="h-4 w-4 m-1"/>}

                                        </button>
                                    }

                                    <button
                                        onClick={() => setSelectedLabels(prev => {
                                            // Just use this function to get all labels so you can select or unselect them all
                                            reorderedLabelsRef.current = []
                                            recursivelyOrderLabels([label.id],label.depth)
                                            if(prev.includes(label.id)){
                                                return prev.filter(l => l !== label.id && !reorderedLabelsRef.current.includes(l))
                                            }else{
                                                return [...prev, ...[label.id, ...reorderedLabelsRef.current]]

                                            }
                                        }

                                        )}
                                        className={`flex-1 text-left px-3 py-2 rounded-md text-sm ${
                                            selectedLabels.includes(label.id)
                                                ? 'bg-purple-100 text-purple-700'
                                                : 'hover:bg-gray-100'
                                        }`}
                                    >

                                        {label.name}
                                    </button>
                                    {newChildLabelId != label.id &&
                                        <div className={"flex flex-row gap-2"}>
                                            {label.depth <= 3 &&
                                                <button
                                                    onClick={() => setNewChildLabelId(label.id)}
                                                    className="hidden group-hover:block p-2 text-gray-400 hover:text-purple-500"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            }
                                            <button
                                                onClick={() => {
                                                    reorderedLabelsRef.current = []
                                                    recursivelyOrderLabels([label.id],label.depth)
                                                    for (const childIds of reorderedLabelsRef.current){
                                                        deleteLabel(childIds)
                                                    }
                                                    setCollapsedLabels((prev) => prev.filter((labelId) => labelId !== label.id))

                                                    // delete from the list of the parent label
                                                    if (label.parentLabel){
                                                        setLabels((prev) =>
                                                            prev.map((lx) => {
                                                                if (lx.id === label.parentLabel) {
                                                                    const updated = {
                                                                        ...lx,
                                                                        childLabels: lx.childLabels.filter((lyId) => lyId !== label.id),
                                                                    };
                                                                    return updated;
                                                                }
                                                                return lx;
                                                            })
                                                        );
                                                    }

                                                    deleteLabel(label.id)

                                                }}
                                                className="hidden group-hover:block p-2 text-gray-400 hover:text-red-500"
                                            >
                                                <Trash className="h-4 w-4" />
                                            </button>


                                        </div>
                                    }


                                    {newChildLabelId == label.id && (
                                            <div className="ml-2  left-14">
                                                <input
                                                    type="text"
                                                    value={newChildLabel}
                                                    onChange={(e) => setNewChildLabel(e.target.value)}
                                                    placeholder="Enter label name"
                                                    className="w-full px-3 py-2 border rounded-md"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') addChildLabel(label.id);
                                                        if (e.key === 'Escape') setNewChildLabelId("");
                                                    }}
                                                    autoFocus
                                                />
                                            </div>
                                        )}

                                </div>
                            ))}
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
                            <div
                                key={"Archive"}
                                className="flex items-center justify-between group"

                            >
                                <Archive className="h-4 w-4 m-1"/>
                                <button
                                    onClick={ () => handleAreaButton("archive") }
                                    className={`flex-1 text-left px-3 py-2 rounded-md text-sm ${
                                        selectedArea == "archive"
                                            ? 'bg-purple-100 text-purple-700'
                                            : 'hover:bg-gray-100'
                                    }`}
                                >

                                    Archive
                                </button>

                            </div>
                        </div>

                    </div>

                </div>
            </div>

            {/* Main content */}
            <div className={`${!actionBarToggled ? "ml-[20%]" : "ml-[15%]"} ${handleToggleLogic("ml-4", "ml-[15%]", "ml-[10%]", "ml-[20%]")} pl-6 position-transition `}>

                <div className={"p-16"}>
                    <input placeholder={"Search Notes"}
                           value={searchValue}
                           onChange={(e) => setSearchValue(e.target.value)}
                           className={"w-full h-16 rounded-md p-4 relative bottom-32 border-2 border-gray-300"}/>
                </div>
                <button
                    onClick={addNote}


                    className={`fixed bottom-16 ${actionBarToggled ? "left-[-10%]":"left-2"} bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors z-[99] position-transition`}
                >
                    <Plus className="h-6 w-6" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4  ">
                    {filteredNotes.map(note => (
                        <div className={"relative group bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow hover:border-gray-400 "}
                             onMouseEnter={() => setIsHovered(note.id)}
                             onMouseLeave={() => setIsHovered(null)}>
                            { ((isHovered == note.id) || (selectedNotes.indexOf(note.id) !== -1)) && (
                                <div className={"absolute  top-[-3%] left-[-3%]  rounded-full  border-purple-400 border-2 p-2 opacity-100 hover:bg-purple-400 transition-opacity "
                                    + (selectedNotes.indexOf(note.id) !== -1 ?"bg-purple-400 ":"") }
                                     onClick={ () => {
                                         if(selectedNotes.indexOf(note.id) !== -1) {
                                             setSelectedNotes(prev => prev.filter(id => id !== note.id));
                                             return;
                                         }
                                         setSelectedNotes(prev => [...prev, note.id]

                                         )}}

                                >

                                    <Check className={"w-4 h-4 "}></Check>

                                </div>
                            )}
                            <div
                                key={note.id}
                                onClick={ () => {
                                    handleNoteClick(note.id)
                                    setIsHovered(null)
                                }}

                                className={"z-25 " + (selectedNotes.indexOf(note.id) !== -1 ?"border-purple-400 ":"")}
                            >



                                <input
                                    type="text"
                                    value={notes.find((n) => n.id == note.id)?.title}
                                    onChange={(e) => setNotes(notes.map((n) => {
                                        if(n.id == note.id){
                                            editedNotes.push(n.id)
                                            return {...n, title: e.target.value};
                                        }
                                        return n;
                                    }))}

                                    placeholder="Title"
                                    className="w-full font-medium focus:outline-none text-[1.5rem] "
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <div className="text-gray-600 min-h-[20rem] max-h-[20rem] whitespace-pre-line overflow-y-hidden">
                                    {note.content.map((cont, i) =>
                                        cont.type === "text" ? (
                                            <div className={"mb-4"}>
                                                <p key={i} >{cont.content == "" ? "Take a note...": cont.content}</p>
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
                        </div>

                    ))}
                </div>
            </div>

            {/* Expanded note modal */}
            {expandedNoteId && (
                <NoteModal modalRef={modalRef} permetatelyDeleteNote={permetatelyDeleteNote} changeStatusOfNote={changeStatusOfNote} indexSelected={indexSelected} notes={notes} setNotes={setNotes}
                           setIsLabelsDropdownOpen={setIsLabelsDropdownOpen} isLabelsDropdownOpen={isLabelsDropdownOpen} expandedNoteId={expandedNoteId} setExpandedNoteId={setExpandedNoteId} TIMEOUT_LENGTH={TIMEOUT_LENGTH}
                labels={labels} setMenuPos={setMenuPos}/>
            )}
        </div>
    );
}