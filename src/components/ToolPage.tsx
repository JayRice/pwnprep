import React, { useState } from 'react';
import { useParams, Link, useLocation, useNavigate  } from 'react-router-dom';
import { tools } from '../data/routes';
// import { Lock, ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import CodeBlock from './CodeBlock';
import { Toaster } from 'react-hot-toast';
import {commonPorts} from "../data/ports.ts";
import { getAuth } from 'firebase/auth'
import {getPremiumContent} from "../database/database.ts";


interface Section {
  id: string;
  title: string;
  content: string;
  commands?: [string ,string];
}

interface Props {
  type: "port" | "tool" | "technique";
}

export default function ToolPage({type}: Props) {

  const { toolId, sectionId } =  useParams<{ toolId: string; sectionId?: string }>();


  const { targetParams } = useStore();

  const navigate = useNavigate();

  const [sectionIndex, setSectionIndex] = useState(0);



  let tool = null;
  let toolDir = ""
  if (type == "tool"){
    tool = tools.find(t => t.id === toolId);
    toolDir = "tools";
  }else if (type == "port"){
    tool = commonPorts.find(p => p.port === Number(toolId));
    toolDir = "ports";
  }
  if (!tool) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Tool not found</h1>
      </div>
    );
  }

  const sectionLength = tool.sections?.length;
  if(sectionIndex < 0) {setSectionIndex(sectionLength - 1)}
  else if (sectionIndex > sectionLength - 1) {setSectionIndex(0)}


  let currentSection = tool.sections[sectionIndex];

  if (sectionId){
    tool.sections?.forEach((section, index) => {
      if (section.id === sectionId) {
        currentSection = tool.sections[index];
      }
    })
  }

  console.log(sectionIndex)




  const replaceParams = (command: string) => {
    return command
      .replace(/\[IP\]/g, targetParams.ip || '[IP]')
      .replace(/\[PORT\]/g, targetParams.port || '[PORT]')
      .replace(/\[SERVICE\]/g, targetParams.service || '[SERVICE]');
  };

  const codeBlockAndExplanation = (section: Section) => {



    return (section.commands.map((data, index) => {
        const rawCode = data[0];
        const explanation = data[1];
       return( <div>
          <p className="text-gray-700 text-2xl mb-4 mt-10 font-bold">{explanation}</p>
          <CodeBlock key={index} code={replaceParams(rawCode)} />
        </div>)
      }))
  }



  return (
    <div className="flex min-h-screen bg-gray-50">
      <Toaster position="bottom-right" />
      
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 fixed h-[calc(100vh-4rem)] top-16">
        <nav className="h-full overflow-y-auto">
          <button id={"test-button"} className={"absolute w-4 h-4 bg-purple-500 text-white top-16 z-50"}
          onClick={() => getPremiumContent({"certification": "cpts"})}
          ></button>
          <div className="p-4 mt-14">
            <div className="flex items-center gap-2 mb-6">
              {type=="tool" && <tool.icon className="h-6 w-6 text-purple-600" />}
              <h2 className="text-lg font-semibold text-gray-900">{tool.title}</h2>
            </div>
            
            <div className="space-y-1">

              {tool.sections?.map((section, index) => {


                return (
                <Link

                    to={`/${toolDir}/${toolId}/${section.id}`}

                  key={section.id}

                  onClick={() => {

                    setSectionIndex(index);

                    navigate(`/${toolDir}/${toolId}/${section.id}`, { replace: true })
                  }}
                  className={`block px-4 py-2 rounded-md ${
                      currentSection.id === section.id
                      ? 'bg-purple-50 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {section.title}
                </Link>
              )})}
            </div>


          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 pl-64">
        <div className="max-w-4xl mx-auto px-8 py-8">
          <div className="prose max-w-none">




              <div key={currentSection.id} id={currentSection.id} className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{currentSection.title}</h2>
                <p className="text-gray-700 mb-6">{currentSection.content}</p>
                
                {currentSection.commands && (
                  <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                    {codeBlockAndExplanation(currentSection)}
                  </div>
                )}
              </div>




          </div>
        </div>
      </div>
    </div>
  );
}