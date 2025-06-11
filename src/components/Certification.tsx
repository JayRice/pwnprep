import {useEffect, useRef, useState} from 'react';
import { useParams, Link  } from 'react-router-dom';

import CodeBlock from './CodeBlock';
import toast, { Toaster } from 'react-hot-toast';

import {getPremiumContent, isPremium} from "../database/database.ts";

import {useStore} from "../store/useStore.ts"


interface Section {
    id: string;
    title: string;
    content: string;
    commands?: [string, string][];
    bullets?: [string, string[]][];
}
interface Certification {
    id: string;
    title: string;
    section : Section;
    path: string;
    sections: Section[];
    type?: "text" | "code";

}

const SECTION_PREM_LIMIT = 4;

export default function CertificationPage() {

    const { certId, sectionId } =  useParams<{ certId: string; sectionId?: string }>();


    const { targetParams } = useStore();



    const [sectionIndex, setSectionIndex] = useState(0);

    const [cert, setCert] = useState<Certification | null>(null);

    const premium = useStore((state) => state.isPremium);

    const message = useRef("Loading...")



    useEffect(() => {

        if(!certId || !sectionId){
            return;
        }
        getPremiumContent({certId:certId, sectionId: sectionId}).then((result) => {

            setCert(result);

        }).catch((err) => {
            return toast("You have to be premium to access this feature!")

            message.current = err.message;
        })
    }, [certId, sectionId]);




    if (!cert || !cert.section) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center font-light">
                <h1 className="text-7xl text-gray-900 mb-8">{message.current}</h1>
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




    const formatBulletPoints = (section: Section) => {


        if(!section.bullets) {return}

        return (section.bullets.map((data) => {
            const listTitle = data[0];
            const bullets = data[1];
            return(
                <div className={"border-2 border-purple-700 p-8 flex flex-row items-center h-full"}>
                    <h2 className={"grow-1 w-full text-white text-2xl font-bold"}>{listTitle}</h2>
                    <ul className={"grow-1 w-full "}>
                        {bullets.map((bullet) => (

                                <li className={"p-4"}>{bullet}</li>


                        ))}

                    </ul>
                </div>
            )
        }))
    }

    const formatCodeBlocks = (section: Section) => {

        if(!section.commands) {return (<div></div>)}

        return (section.commands.map((data) => {
            const rawCode = data[0];
            const explanation = data[1];
            return( <div>
                <p className="text-gray-700 text-2xl mb-4 mt-10 font-bold">{explanation}</p>

                <CodeBlock key={`${cert.section.id}-${rawCode.slice(0, 10)}`} code={rawCode} inNotes={false} interactive={true} />


            </div>)
        }))
    }


    return (
        <div className="flex min-h-screen bg-gray-50">
            <Toaster position="bottom-right"/>

            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 fixed h-[calc(100vh-4rem)] top-16 left-16">
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
                                        }}
                                        className={`block px-4 py-2 rounded-md grow-1 ${
                                            currentSection.id === section.id
                                                ? 'bg-purple-50 text-purple-700'
                                                : 'text-gray-600 hover:bg-gray-50'
                                                }
                                            ${(!premium && index > SECTION_PREM_LIMIT) ? "opacity-50":""}
                                        `}
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