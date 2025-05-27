import React, {JSX} from "react"
import {AlignLeft, Code, Plus, Tag, Trash, Undo2, X} from "lucide-react";

import {Note, Label} from "../data/interfaces.ts";
import {DB_deleteNote} from "../database/database.ts";
import CodeBlock from "./CodeBlock.tsx";
import {useStore} from "../store/useStore.ts";


interface Props{
    modalRef: React.RefAttributes<HTMLDivElement> | null;
    indexSelected: React.RefAttributes<number> | null;
    notes: Note[];
    setNotes: (notes: Note[]) => void;
    isLabelsDropdownOpen: boolean;
    setIsLabelsDropdownOpen: (isLabelsDropdownOpen: boolean) => void;
    expandedNoteId: string;
    setExpandedNoteId: (isExpandedNoteId: string | null) => void;
    TIMEOUT_LENGTH: number;
    labels: Label[];
    setMenuPos: (pos: { x: number; y: number } | null) => void

}

export default function NoteModal({modalRef, indexSelected, notes, setNotes, setIsLabelsDropdownOpen, isLabelsDropdownOpen, expandedNoteId, setExpandedNoteId, TIMEOUT_LENGTH, labels, setMenuPos}: Props)  {



    const {targetParams} = useStore();

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
    const handleContextMenu = (e: React.MouseEvent, index: number) => {
        e.preventDefault(); // disable default right-click
        setMenuPos({ x: e.pageX, y: e.pageY });
        indexSelected.current = index;
    };

    const handleTagClick = () => {
        setIsLabelsDropdownOpen(prevState => !prevState);
    }
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
    const handleCodeClick = () => {
        // Add code block
        addNoteContent(expandedNoteId, "", "code");
        // Add textarea under code block
    }
    const handleTextClick = () => {
        addNoteContent(expandedNoteId, "", "text");
    }

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
    const updateCodeContent = (codeBlockId: string, content: string) =>{
        setNotes((prev) => prev.map((note) => {
            if (note.id == expandedNoteId){
                note.content[codeBlockId].content = revertParams(content);
            }
            return note;
        }))

    }


    const parseNoteContent = (note: Note) =>{

        let jsx : JSX.Element[] = [];


        for (let i = 0; i<note.content.length; i++){
            // textarea every even
            if (note.content[i].type == "text"){
                jsx.push(

                    <textarea key={i} value={note.content[i].content} maxLength={50000}
                              ref={((el) => {
                                  if(!el) return;
                                  el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px';

                              })}
                              onContextMenu={(e) => handleContextMenu(e, i)}
                              onChange={(e) => {
                                  updateNoteContent(note.id, i, e.target.value);
                                  // updateNoteInLine(expandedNote, { content: e.target.value })
                                  e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px';
                              }}


                              placeholder="Take a note..."
                              className="w-full  resize-none focus:outline-none overflow-hidden relative group "
                    />

                );
            }
            // codeblock every odd
            else if (note.content[i].type == "code"){
                jsx.push(<CodeBlock id={i}  onContextMenu={(e) => handleContextMenu(e, i)} interactive={true}
                                    refactoredCode={replaceParams(note.content[i].content)} code={note.content[i].content} deleteCodeBlock={deleteCodeBlock} className={"mb-4"}  updateCodeContent={updateCodeContent}/>);
            }
        }
        return (jsx);
    }

    const updateNoteInLine = (noteId: string, updates: Partial<Note>) => {
        setNotes((prev) => prev.map(note =>
            note.id === noteId ? { ...note, ...updates } : note
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


    return (
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
                            parseNoteContent(notes.find(n => n.id === expandedNoteId))
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

    )
}
