import React, { useState, useEffect, useRef } from 'react';
import { Link , useNavigate} from 'react-router-dom';
import { commonPorts } from '../data/ports';
import {ClipboardEdit, HdmiPort, Wrench, Bot, Settings} from 'lucide-react';
import ChatBot from "./ChatBot.tsx"
import {Conversation} from "../data/interfaces.ts";
import TargetParamsModal from "./TargetParamsModal.tsx";




const topics = [
    { name: 'NMAP', path: '/tools/nmap' },
    { name: 'PYTHON', path: '/tools/python' },
    { name: 'JAVA', path: '/tools/java' },
    { name: 'PHP', path: '/tools/php' },
    { name: 'PRIVESC', path: '/tools/privesc' },
    { name: 'SHELLS', path: '/tools/shells' },
    { name: 'PERSISTENCE', path: '/tools/persistence' },
    { name: 'OSINT', path: '/tools/osint' },
    { name: 'XSS', path: '/tools/xss' }
];
interface  Props{
    user: User;
    setIsParamsModalOpen: (isOpen: boolean) => void;
    isParamsModalOpen: boolean;
}
export default function ActionNavbar({user, setIsParamsModalOpen, isParamsModalOpen} : Props) {
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
    const dropdownRefPorts = useRef<HTMLDivElement>(null);
    const dropdownRefTools = useRef<HTMLDivElement>(null);
    const dropdownRefAI = useRef<HTMLDivElement>(null);


    const [conversation, setConversation] = useState<Conversation | null>(null);



    const navigate = useNavigate();

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({
            [section]: !prev[section]
        }));
    };

    // close ports dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                openSections['ports'] &&
                dropdownRefPorts.current &&
                !dropdownRefPorts.current.contains(e.target as Node)
            ) {
                setOpenSections(prev => ({ ...prev, ports: false }));
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openSections['ports']]);

    // close tools dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                openSections['tools'] &&
                dropdownRefTools.current &&
                !dropdownRefTools.current.contains(e.target as Node)
            ) {
                setOpenSections(prev => ({ ...prev, tools: false }));
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openSections['tools']]);


    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                openSections['ai'] &&
                dropdownRefAI.current &&
                !dropdownRefAI.current.contains(e.target as Node)
            ) {
                setOpenSections(prev => ({ ...prev, ai: false }));
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openSections['ai']]);

    return (
        <div className="fixed top-0 left-0 right-0 w-16 h-full bg-gray-900 text-white z-40 flex flex-col gap-6 pt-[8%] items-center" >




                     <div className="relative group" ref={dropdownRefAI}>
                        <button
                            onClick={() => toggleSection("ai")}
                            className="flex items-center  h-full w-full p-2  text-white  space-x-1 text-sm hover:bg-purple-600 transition-colors
                                                    bg-purple-500 rounded-full"
                        >

                            <Bot className="h-8 w-8" />
                        </button>

                         {openSections['ai'] && (
                             <div className="absolute left-8 mt-2 w-96 bg-gray-800 rounded-md shadow-lg py-2 z-50">
                                <ChatBot user={user} isPremium={true}  conversation={conversation}  setConversation={setConversation}></ChatBot>
                             </div>
                         )}


                    </div>

                    <div className="relative group">
                        <button
                            onClick={() => navigate("/notes")}
                            className="flex items-center  h-full w-full p-2  text-white  space-x-1 text-sm hover:bg-purple-600 transition-colors
                                            bg-purple-500 rounded-full"
                        >

                            <ClipboardEdit className="h-8 w-8" />
                        </button>


                    </div>

                    {/* Ports Dropdown */}
                    <div className="relative group" ref={dropdownRefPorts}>
                        <button
                            onClick={() => toggleSection('ports')}
                            className="flex items-center  h-full w-full p-2  text-white  space-x-1 text-sm hover:bg-purple-600 transition-colors
                            bg-purple-500 rounded-full"
                        >
                            <HdmiPort className="h-8 w-8" />
                        </button>

                        {openSections['ports'] && (
                            <div className="absolute left-8 mt-2 w-96 bg-gray-800 rounded-md shadow-lg py-2 z-50 overflow-y-auto max-h-64">
                                <div className="grid grid-cols-2 gap-2 p-3">
                                    {commonPorts.map(port => (
                                        <Link
                                            key={port.port}
                                            to={`/ports/${port.port}`}
                                            className="block px-3 py-2 hover:bg-gray-700 rounded transition-colors"
                                        >
                                            <div className="text-lg font-mono text-purple-400">{port.port}</div>
                                            <div className="text-sm text-gray-300">{port.service}</div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tools Dropdown */}
                    <div className="relative group" ref={dropdownRefTools}>
                        <button
                            onClick={() => toggleSection('tools')}
                            className="flex items-center  h-full w-full p-2  text-white  space-x-1 text-sm hover:bg-purple-600 transition-colors
                            bg-purple-500 rounded-full"
                        >

                            <Wrench className="h-8 w-8" />
                        </button>

                        {openSections['tools'] && (
                            <div className="absolute left-8 mt-2 w-96 bg-gray-800 rounded-md shadow-lg py-2 z-50 overflow-y-auto max-h-64">
                                <div className="grid grid-cols-2 gap-2 p-3">
                                    {topics.map(topic => (
                                        <Link
                                            key={topic.path}
                                            to={topic.path}
                                            className="px-3 py-2 text-sm hover:bg-gray-700 rounded transition-colors"
                                        >
                                            {topic.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={"flex flex-col gap-3 mt-auto mb-2"}>
                        <div className="">
                            <button
                                onClick={() => setIsParamsModalOpen(true)}
                                className="bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition "
                            >
                                <Settings className="h-6 w-6" />
                            </button>
                            <TargetParamsModal
                                isOpen={isParamsModalOpen}
                                onClose={() => setIsParamsModalOpen(false)}
                            />
                        </div>
                    </div>







        </div>
    );
}