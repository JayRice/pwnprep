import {useEffect, useState, useRef} from "react"
import {Conversation, Message} from "../data/interfaces.ts"
import {addMessageToConversation, getConversation} from "../database/database.ts";
import {getAuth} from "firebase/auth";
import axios, { AxiosError } from "axios";


import {toast} from "react-hot-toast"

interface Props {
    isPremium: boolean;
    user: User | null;

    conversation: Conversation | null;
    setConversation: (conversation: Conversation) => void;
}

import CodeBlock from "./CodeBlock";



const REMEMBER_HISTORY_LENGTH = 10;

export default function ChatBot({user, isPremium, conversation, setConversation} : Props){

    const [isDisable, setDisable] = useState<boolean>(!(user && isPremium))

    const [userMessage, setUserMessage] = useState("");


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

        if (messageListRef.current) {
            //messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
            messageListRef.current.scrollIntoView({behavior: "smooth", block: "end"});
        }
    }, [conversation]);

    const addMessage = async (message: string) =>{
        setDisable(true)
        const userMessage : Message = {
            content: message,
            role: "user",
            timestamp:  new Date().toISOString()
        }

        setConversation((prev) => {
            if (!prev) {return null}
            return {...prev, messages: [...prev.messages, userMessage]}
        })
        postMessage(userMessage).then((response) => {

            if(!response){
                return toast("Too many requests - try again later.");
            }

            setDisable(false)
            const botMessage : Message = {
                content: response.content,
                role: "assistant",
                timestamp:  new Date().toISOString()
            }
            setConversation((prev) => {
                if (!prev) {return null}
                return {...prev, messages: [...prev.messages, botMessage]}
            })

        });

    }


    return (<div className={"w-full h-full p-2"}>

        <div className={"h-[35vh] m-4 mb-12 flex items-center justify-between flex-col overflow-y-auto gap-4 p-2 pr-4 custom-scrollbar break-words "}>
            <div className={"bg-purple-700 w-full h-auto p-2 border-lg relative rounded-lg  "}>
                <p className={"text-xl"}>Hey, I'm your personal AI assistant. Ask me anything cybersecurity related. </p>
            </div>

            {conversation && (<div ref={messageListRef}>
                {conversation.messages.map((message) => (

                    <div>
                        <div className={"w-full h-auto p-2 border-lg relative rounded-lg mt-8 mb-8  " + (message.role == "user" ? "bg-gray-900":"bg-purple-700")}>
                            <p className={"text-xl"}>{message.content}</p>

                        </div>
                        <CodeBlock code={"Code hehe"} inNotes={false} inChat={true}></CodeBlock>
                        <CodeBlock code={"Code hehe"} inNotes={false} inChat={true}></CodeBlock>
                    </div>

                ))}
            </div>)}
        </div>
        <textarea ref={textAreaRef} maxLength={1000} id={"chatbot-ta"} value={userMessage} disabled={isDisable} className={"bg-gray-900 rounded-md w-full h-[10vh] overflow-y-auto resize-none custom-scrollbar p-2"} placeholder={"Ask me anything"}
        onChange={(e) => setUserMessage(e.target.value)}></textarea>
        <div  className={"flex w-full gap-2 "}>
            <button disabled={isDisable} className={"w-full h-[5vh] bg-gray-900 hover:bg-gray-600 rounded-md transition"} onClick={() => {
                if(userMessage.trim() != ""){
                    addMessage(userMessage);
                    setUserMessage("");
                }

            }}> Enter </button>
            <button className={"w-full h-[5vh] bg-red-800 hover:bg-red-900 rounded-md transition"} onClick={() => {
                setConversation((prev) => {
                    return {...prev, messages: []}
                });
            }}> Clear Conversation </button>


        </div>
    </div>)
}