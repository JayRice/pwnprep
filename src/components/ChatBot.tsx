import React, {useEffect, useState, useRef} from "react"
import {Conversation, Message} from "../data/interfaces.ts"
import {addMessageToConversation, getConversation} from "../database/database.ts";
import {getAuth} from "firebase/auth";


import {toast} from "react-hot-toast"

interface Props {
    user: import('firebase/auth').User | null;

    conversation: Conversation | null;
    setConversation: React.Dispatch<React.SetStateAction<Conversation | null>>;
}

import CodeBlock from "./CodeBlock";
import {useStore} from "../store/useStore.ts";




export default function ChatBot({user, conversation, setConversation} : Props){

    const isPremium = useStore((state) => state.isPremium);


    const [isDisable, setDisable] = useState<boolean>(!(user && isPremium))

    const [userMessage, setUserMessage] = useState("");

    const AIMessage = useStore((state) => state.AIMessage)
    const setAIMessage = useStore((state) => state.setAIMessage)


    const [isBotThinking, setBotThinking] = useState<boolean>(false)


    useEffect(() => {
        if(AIMessage!=""){
            setUserMessage(AIMessage)
        }
    }, []);




    const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
    const messageListRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {

        if (!conversation){
            getConversation().then((convo)=>{
                if (typeof convo === "object" && convo !== null && "messages" in convo){
                    setConversation(convo as Conversation)

                }
            })
        }

    }, []);

    type ParsedBlock = {
        type: "code" | "text";
        content: string;
    };

    function parseTaggedResponse(input: string): ParsedBlock[] {
        const regex = /<\s*(c|t)\s*>([\s\S]*?)<\s*\/\s*\1\s*>/gi;
        const result: ParsedBlock[] = [];

        let match;
        while ((match = regex.exec(input)) !== null) {
            const [, tag, content] = match;
            result.push({
                type: tag.toLowerCase() === "c" ? "code" : "text",
                content: content.trim(),
            });
        }

        return result;
    }
    const postMessage = async (message: Message) => {

        const user = getAuth().currentUser;
        if(!user) throw new Error("Not signed in");

        const token = await user.getIdToken();

        if (!conversation) throw new Error("Conversation not found");


        try{
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/premium/chatbot`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ content: {message: message}}),
            });

            const json = await res.json();
            if(!res.ok){

                console.error("Error while retrieving chatbot response: ", json.error);
                throw new Error(json.error.message);
            }else{

                return json;

            }
        }catch   {
            toast("Too many requests - try again later.");

        }
    }
    useEffect(() => {
        if (!conversation) return;

        addMessageToConversation(conversation.messages);


        setTimeout(() => {
            if(messageListRef.current)
            messageListRef.current.scrollIntoView({behavior: "smooth", block: "end"});

        }, 250)

    }, [conversation, isBotThinking]);

    const addMessage = async (message: string) =>{
        setDisable(true)
        const userMessage : Message = {
            content: message,
            role: "user",
            timestamp:  new Date().toISOString(),
            type: "text"
        }

        if(!conversation) {return}
        setConversation((prev) => {
            if (!prev) return prev;

            return {
                ...prev,
                messages: [...prev.messages, userMessage],
                updatedAt: Date.now(),
            };
        });
        setBotThinking(true);
        postMessage(userMessage).then((response) => {
            setBotThinking(false);
            if(!response){
                return toast("Something went wrong - try again later.");
            }

            setDisable(false)
            const messages: Message[] = []

            const parsed = parseTaggedResponse(response.content);
            console.log("PArsed: ", parsed, response)

            if(!parsed){
                return toast("Something went wrong - try again later.");
            }
            for (const message of parsed){
                if(!message.content || !message.type){continue}
                const botMessage : Message = {
                    content: message.content,
                    role: "assistant",
                    timestamp:  new Date().toISOString(),
                    type: message.type
                }
                messages.push(botMessage);
            }

            if(messages.length == 0){
                return toast("Something went wrong with this assistant... try again later.")
            }

            setConversation((prev) => {
                if (!prev) return prev;

                return {
                    ...prev,
                    messages: [...prev.messages, ...messages],
                    updatedAt: Date.now(),
                };
            });

        });

    }

    useEffect(() => {
        if (isBotThinking && messageListRef.current) {
            messageListRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }, [isBotThinking]);


    return (<div className="w-full h-full p-2 overflow-hidden">
            <div className="h-[50vh] m-4 mb-12 flex flex-col justify-between gap-4 p-2 pr-4 overflow-y-auto custom-scrollbar">

                <div className="bg-purple-700 w-full p-3 rounded-lg break-words overflow-wrap break-word whitespace-pre-wrap">
                    <p className="text-xl text-white">
                        Hey, I'm your personal AI assistant. Ask me anything cybersecurity related.
                    </p>
                </div>

                {conversation && (
                    <div ref={messageListRef} className="flex flex-col gap-4">

                        {conversation.messages.map((message, idx) => {

                            return message.type == "text" ? (<div
                                    key={idx}
                                    className={`w-full p-3 rounded-lg break-words whitespace-pre-wrap overflow-wrap break-word ${
                                        message.role === "user" ? "bg-gray-900 text-white mt-16" : "bg-purple-700 text-white"
                                    }`}
                                >
                                    <p className="text-xl" title={message.role.toUpperCase()}> {message.content}</p>
                                </div>
                            ): (
                                <CodeBlock inChat={true} code={message.content} inNotes={false} interactive={false}></CodeBlock>
                            )


                        })}
                    </div>
                )}

                {isBotThinking && (
                    <div className="bg-purple-700 w-full p-3 rounded-lg break-words whitespace-pre-wrap overflow-wrap break-word text-white">
                        <p className="text-xl">Thinking...</p>
                    </div>
                )}
            </div>

            <textarea
                ref={textAreaRef}
                maxLength={1000}
                id="chatbot-ta"
                value={userMessage}
                disabled={isDisable}
                placeholder="Ask me anything"
                className="bg-gray-900 text-white rounded-md w-full h-[10vh] overflow-y-auto resize-none custom-scrollbar p-2 break-words whitespace-pre-wrap"
                onChange={(e) => {
                    setAIMessage("");
                    setUserMessage(e.target.value);
                }}
            ></textarea>

            <div className="flex w-full gap-2 mt-2">
                <button
                    disabled={isDisable}
                    className="w-full h-[5vh] bg-gray-900 hover:bg-gray-600 text-white rounded-md transition"
                    onClick={() => {
                        setAIMessage("");
                        if (userMessage.trim() !== "") {

                            addMessage(userMessage);
                            setUserMessage("");
                        }
                    }}
                >
                    Enter
                </button>

                <button
                    className="w-full h-[5vh] bg-red-800 hover:bg-red-900 text-white rounded-md transition"
                    onClick={() => {
                        if (!conversation) return;
                        setConversation({ ...conversation, messages: [] });
                    }}
                >
                    Clear Conversation
                </button>
            </div>
        </div>
    )
}