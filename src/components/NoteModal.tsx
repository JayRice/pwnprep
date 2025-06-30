import React, {JSX, useEffect} from "react"
import {AlignLeft, Archive, Code, Plus, Tag, Trash, Undo2, X} from "lucide-react";

import {Note, Label} from "../data/interfaces.ts";
import CodeBlock from "./CodeBlock.tsx";
import {revertParams} from "../regex/regex.ts";




interface Props{
    modalRef: React.RefObject<HTMLDivElement> | null;
    indexSelected: React.MutableRefObject<number> | null;
    notes: Note[];
    setNotes: (notes: Note[]) => void;
    isLabelsDropdownOpen: boolean;
    setIsLabelsDropdownOpen: (isLabelsDropdownOpen: boolean) => void;
    expandedNoteId: string;
    setExpandedNoteId: (isExpandedNoteId: string | null) => void;
    TIMEOUT_LENGTH: number;
    labels: Label[];
    setMenuPos: (pos: { x: number; y: number } | null) => void
    changeStatusOfNote: (noteId: string, status: string) => void;
    permetatelyDeleteNote: (noteId: string) => void;

}

export default function NoteModal({modalRef, indexSelected, notes, setNotes, setIsLabelsDropdownOpen, isLabelsDropdownOpen, expandedNoteId, setExpandedNoteId, labels, setMenuPos, changeStatusOfNote, permetatelyDeleteNote}: Props)  {

    useEffect(() => {

    })


    const handleContextMenu = (e: React.MouseEvent, index: number) => {
        e.preventDefault(); // disable default right-click

        setMenuPos({ x: e.pageX, y: e.pageY });

        if(indexSelected)  indexSelected.current = index;
    };

    const handleTagClick = () => {
        setIsLabelsDropdownOpen(!isLabelsDropdownOpen);
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




    const addNoteContent = (noteId: string, textBlock: string, type: string) => {
        // adds a text block to the content list so that textareas and codeblocks can be seperated
        setNotes(notes.map(note => {
                if (note.id === noteId) {
                    note.content.push({id: new Date().toISOString(), type: type, content: textBlock});
                }
                return note;
            }
        ));
    };


    // const deleteCodeBlock = (index: number) =>{
    //
    //     setNotes(notes.map((note) => {
    //
    //         const noteContent = [...note.content];
    //
    //         if (note.id != expandedNoteId){return note}
    //
    //         noteContent.splice(index,1);
    //
    //         // refactor text blocks
    //         // for (let i = 0; i < note.content.length; i++) {
    //         //     if (i <= 0) {continue;}
    //         //     // Combine both text to avoid repitition
    //         //     if (noteContent[i-1].type == "text" && noteContent[i].type == "text"){
    //         //         noteContent[i-1].content += "\n" + noteContent[i].content;
    //         //         noteContent.splice(i, 1);
    //         //         i--;
    //         //     }
    //         //
    //         // }
    //         return {...note, content: noteContent};
    //     }))
    // }


    const updateCodeContent = (codeBlockId: string, content: string) =>{
        revertParams(content).then((reverted) => {
            setNotes(notes.map((note) => {
                if (note.id == expandedNoteId){
                    const index = note.content.findIndex((cont) => {
                        return cont.id == codeBlockId
                    })
                    note.content[index].content = reverted
                }
                return note;
            }))
        })




    }


    const parseNoteContent =  (note: Note) =>{

        const jsx : JSX.Element[] = [];


        for (let i = 0; i<note.content.length; i++){

            const block = note.content[i]
            // textarea every even
            if (block.type == "text"){
                jsx.push(

                    <textarea key={block.id} value={block.content} maxLength={50000}
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
            else if (block.type == "code"){
                jsx.push(<CodeBlock key={block.id} id={block.id} inNotes={true} onContextMenu={(e) => handleContextMenu(e, i)} interactive={true}
                                    refactoredCode={ note.content[i].content} code={note.content[i].content} className={"mb-4"}  updateCodeContent={updateCodeContent}
                                    closeParent={() => {
                                        setExpandedNoteId(null);
                                    }}/>);
            }
        }
        return (jsx);
    }

    const noteLabels : JSX.Element[] = labels.map(label => {
        // grab the expanded note (or undefined if none)
        const note = notes.find(n => n.id === expandedNoteId);

        if (!note) return <div></div>;

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
    const handleAddNoteLabel = (labelId: string) => {

        setNotes(notes.map(n =>
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

    const updateNoteInLine = (noteId: string, updates: Partial<Note>) => {
        setNotes(notes.map(note =>
            note.id === noteId ? { ...note, ...updates } : note
        ));
    };

    const updateNoteContent = (noteId: string, contentIndex: number, content: string) => {
        // updates content to the actual textareas and codeblocks
        setNotes(notes.map(note => {
                if (note.id === noteId) {

                    note.content[contentIndex].content = content;
                }
                return note;
            }
        ));
    };



    const expandedNote = notes.filter((note) => note.id === expandedNoteId)[0];
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[99]">
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
                            parseNoteContent(expandedNote)
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
                                (<div className="absolute flex flex-col mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200 p-1 max-h-[8rem] overflow-y-scroll">

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



                                // permetately delete
                                if (expandedNote.status == "trash"){
                                    permetatelyDeleteNote(expandedNoteId)
                                    return;
                                }
                                changeStatusOfNote(expandedNoteId, "trash")
                            }
                            }
                            className="p-2 text-red-500 hover:text-red-600 rounded-full hover:bg-red-50"
                            title={expandedNote.status=="trash" ? "Permenately Delete":"Delete"}
                        >
                            <Trash className="h-4 w-4" />
                        </button>
                        {expandedNote.status != "archive" &&
                            <button
                                onClick={() => {

                                    changeStatusOfNote(expandedNoteId, "archive")
                                }
                                }
                                className="p-2 text-purple-500 hover:text-purple-600 rounded-full hover:bg-red-50"
                                title={"Archive"}
                            >
                                <Archive className="h-4 w-4" />
                            </button>
                        }

                        {expandedNote.status != "active" &&
                            <button
                                onClick={() => {
                                    handleReactivateClick(expandedNoteId)
                                }}
                                className="p-2 text-purple-500 hover:text-purple-600 rounded-full hover:bg-purple-50"
                                title={"Reactivate"}
                            >
                                <Undo2 className="h-4 w-4" />
                            </button>}
                    </div>
                </div>
            </div>
        </div>

    )
}
