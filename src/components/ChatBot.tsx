import {useEffect, useState, useRef} from "react"
import {Conversation, Message} from "../data/interfaces.ts"
import {addMessageToConversation, getConversation} from "../database/database.ts";
import {getAuth} from "firebase/auth";
interface Props {
    isPremium: boolean;
    user: User | null;

    conversation: Conversation | null;
    setConversation: (conversation: Conversation) => void;
}



const REMEMBER_HISTORY_LENGTH = 10;

export default function ChatBot({user, isPremium, conversation, setConversation} : Props){

    const [isDisable, setDisable] = useState<boolean>(!(user && isPremium))

    const [userMessage, setUserMessage] = useState("");


    const textArearef = useRef<HTMLTextAreaElement | null>(null)
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

        let history = [...conversation.messages, message];

        if (history.length > REMEMBER_HISTORY_LENGTH){
            history = history.slice(history.length-REMEMBER_HISTORY_LENGTH)
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/premium/chatbot`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ content: {history: history}}),
        });
        const json = await res.json();
        if(!res.ok){

            console.error("Error while retrieving chatbot response: ", json.error);
            throw new Error(json.error.message);
        }else{

            return json;

        }
    }
    useEffect(() => {
        if (!conversation) return;
        console.log("Adding conversation...");
        addMessageToConversation(conversation.messages);

        if (textArearef.current) {
            console.log(textArearef.current?.clientHeight, textArearef.current?.scrollHeight);

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
        <div className={"h-[35vh] m-4 mb-12 flex items-center justify-between flex-col overflow-y-auto gap-4 p-2 pr-4 custom-scrollbar  "}>
            <div className={"bg-purple-700 w-full h-auto p-2 border-lg relative rounded-lg  "}>
                <p className={"text-xl"}>Hey, I'm your personal AI assistant. Ask me anything cybersecurity related. </p>
            </div>

            {conversation && (<div>
                {conversation.messages.map((message) => (

                    <div className={"w-full h-auto p-2 border-lg relative rounded-lg mt-8 mb-8 " + (message.role == "user" ? "bg-gray-900":"bg-purple-700")}>
                        <p className={"text-xl"}>{message.content}</p>
                    </div>
                ))}
            </div>)}
        </div>
        <textarea ref={textArearef} maxLength={1000} id={"chatbot-ta"} value={userMessage} disabled={isDisable} className={"bg-gray-900 rounded-md w-full h-[10vh] overflow-y-auto resize-none custom-scrollbar"} placeholder={"Ask me anything"}
        onChange={(e) => setUserMessage(e.target.value)}></textarea>
        <div  className={"flex w-full "}>
            <button disabled={isDisable} className={"w-full h-8 bg-gray-900 hover:bg-gray-600 rounded-md transition"} onClick={() => {
                if(userMessage.trim() != ""){
                    addMessage(userMessage);
                    setUserMessage("");
                }

            }}> Enter </button>
        </div>
    </div>)
}