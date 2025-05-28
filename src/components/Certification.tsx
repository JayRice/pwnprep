import React, {useEffect, useRef, useState} from 'react';
import { useParams, Link, useNavigate  } from 'react-router-dom';

import { useStore } from '../store/useStore';
import CodeBlock from './CodeBlock';
import { Toaster } from 'react-hot-toast';

import {getPremiumContent} from "../database/database.ts";


interface Section {
    id: string;
    title: string;
    content: string;
    commands?: [string, string][];
    bullets?: [string, string[]][];
}


export default function CertificationPage() {

    const { certId, sectionId } =  useParams<{ certId: string; sectionId?: string }>();


    const { targetParams } = useStore();

    const navigate = useNavigate();

    const [sectionIndex, setSectionIndex] = useState(0);

    const [cert, setCert] = useState<unknown>(null);

    const errorMessage = useRef("Page not found")



    useEffect(() => {
        console.log(certId, sectionId);
        getPremiumContent({certId:certId, sectionId: sectionId}).then((result) => {

            setCert(result);

        }).catch((err) => {
            navigate("/premium")
            errorMessage.current = err.message;
        })
    }, [certId, sectionId]);




    if (!cert) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center font-light">
                <h1 className="text-7xl text-gray-900 mb-8">{errorMessage.current}</h1>
            </div>
        );

    }
    let currentSection = cert.sections[sectionIndex];

    if (sectionId && cert.sections){
        cert.sections?.forEach((section, index) => {
            if (section.id === sectionId) {
                currentSection = cert.sections[index];
            }
        })
    }


    const replaceParams = (command: string) => {
        return command
            .replace(/\[IP\]/g, targetParams.ip || '[IP]')
            .replace(/\[PORT\]/g, targetParams.port || '[PORT]')
            .replace(/\[SERVICE\]/g, targetParams.service || '[SERVICE]');
    };

    const formatBulletPoints = (section: Section) => {


        if(!section.bullets) {return}

        return (section.bullets.map((data, index) => {
            const listTitle = data[0];
            const bullets = data[1];
            return(
                <div className={"border-2 border-purple-700 p-8 flex flex-row items-center h-full"}>
                    <h2 className={"text-gray-700 text-2xl mb-4 mt-10 font-bold"}>{listTitle}</h2>
                    <ul>
                        {bullets}
                    </ul>
                </div>
            )
        }))
    }

    const formatCodeBlocks = (section: Section) => {

        if(!section.commands) {return (<div></div>)}

        return (section.commands.map((data, i) => {
            const rawCode = data[0];
            const explanation = data[1];
            return( <div>
                <p className="text-gray-700 text-2xl mb-4 mt-10 font-bold">{explanation}</p>
                {Array.isArray(explanation) && explanation.map((data, index) => {
                    <CodeBlock key={`${i}-${index}`} code={replaceParams(rawCode)} />
                })}
                {!Array.isArray(explanation) &&
                    <CodeBlock key={i} code={replaceParams(rawCode)} />
                }

            </div>)
        }))
    }


    return (
        <div className="flex min-h-screen bg-gray-50">
            <Toaster position="bottom-right"/>

            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 fixed h-[calc(100vh-4rem)] top-16">
                <nav className="h-full overflow-y-auto">

                    <div className="p-4 mt-14">
                        <div className="flex items-center gap-2 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">{cert.title}</h2>
                        </div>

                        <div className="space-y-1">

                            {cert.sections?.map((section, index) => {


                                return (
                                    <Link

                                        to={`/tests/${cert.id}/${section.id}`}

                                        key={section.id}

                                        onClick={() => {

                                            setSectionIndex(index);
                                            console.log(index)
                                            navigate(`/tests/${cert.id}/${section.id}`, {replace: true})
                                        }}
                                        className={`block px-4 py-2 rounded-md ${
                                            currentSection.id === section.id
                                                ? 'bg-purple-50 text-purple-700'
                                                : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        {section.title}
                                    </Link>
                                )
                            })}

                        </div>


                    </div>
                </nav>
            </div>

            {/* Main content */}
            <div className="flex-1 pl-64">
                <div className="max-w-4xl mx-auto px-8 py-8">
                    <div className="prose max-w-none">


                        <div key={cert.section.id} id={cert.section.id} className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">{cert.section.title}</h2>
                            <p className="text-gray-700 mb-6">{cert.section.content}</p>

                            {cert.section.commands && (
                                <div>
                                    {cert.section.bullets &&
                                        <div className="bg-purple-800 text-white p-6 rounded-lg space-y-4">
                                            {formatBulletPoints(cert.section)}
                                        </div>
                                    }
                                    {cert.section.commands &&
                                        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                                            {formatCodeBlocks(cert.section)}
                                        </div>
                                    }


                                </div>
                            )}
                        </div>


                    </div>
                </div>
            </div>
            <script async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7752976330063596"
                    crossOrigin="anonymous"></script>
        </div>
    );
}