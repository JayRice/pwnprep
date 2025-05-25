import React, { useState } from 'react';
import { useParams, Link, useNavigate  } from 'react-router-dom';
import { commonPorts } from '../data/ports';
import { useStore } from '../store/useStore';
import CodeBlock from './CodeBlock';
import { Toaster } from 'react-hot-toast';
import {ChevronRight, Lock, Network} from 'lucide-react';

interface Section {
  id: string;
  title: string;
  content: string;
  commands?: [string ,string];
}

/*
{
    port: 21,
    service: 'FTP',
    description: 'File Transfer Protocol - Used for transferring files between systems.',
    defaultState: 'filtered',
    common: true,
    protocol: 'tcp',
    id: 'port-21',
    title: 'FTP (21)',
    path: '/ports/21',
    sections: [
      {
        id: 'common-commands',
        title: 'Common Commands',
        commands: [
          ['ftp [IP] 21', 'Basic connection'],
          ['hydra -l user -P [WORDLIST] ftp://[IP]', 'Brute force'],
          ['wget -m ftp://anonymous:anonymous@[IP]', 'Download all files']
        ]
      },
      {
        id: 'Footprinting',
        title: 'Footprinting',
        commands: [
          ['ftp [IP] 21', 'Check if port is open & grab banner']
        ]
      },
      {
        id: 'Enumeration',
        title: 'Enumeration',
        commands: [
          ['hydra -l user -P [WORDLIST] ftp://[IP]', 'Brute-force login attempts']
        ]
      },
      {
        id: 'Exploitation',
        title: 'Exploitation',
        commands: [
          ['wget -m ftp://anonymous:anonymous@[IP]', 'Try anonymous download']
        ]
      }
    ]
  }
* **/
export default function PortPage() {

  const { portId, sectionId } =  useParams<{ portId: string; sectionId?: string }>();
  const { targetParams } = useStore();
  const port = commonPorts.find(p => p.port === Number(portId));

  if (!port) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Port not found</h1>
      </div>
    );
  }

  const navigate = useNavigate();

  const [sectionIndex, setSectionIndex] = useState(0);

  const sectionLength = port.sections?.length;
  if(sectionIndex < 0) {setSectionIndex(sectionLength - 1)}
  else if (sectionIndex > sectionLength - 1) {setSectionIndex(0)}

  let currentSection = port.sections[sectionIndex];

  if (sectionId){
    port.sections?.forEach((section, index) => {
      if (section.id === sectionId) {
        currentSection = port.sections[index];
      }
    })
  }

  console.log(sectionIndex)

  const replaceParams = (command: string) => {
    return command
      .replace(/\[IP\]/g, targetParams.ip || '[IP]')
      .replace(/\[PORT\]/g, targetParams.port || port.port.toString())
      .replace(/\[SERVICE\]/g, targetParams.service || port.service)
      .replace(/\[WORDLIST\]/g, targetParams.wordlist || "[WORDLIST]");

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Toaster position="bottom-right" />
      <div className="absolute left-0 w-64 bg-white border-r border-gray-200 fixed h-[calc(100vh-4rem)] top-16">
        <nav className="h-full overflow-y-auto">
          <div className="p-4 mt-14">
            <div className="flex items-center gap-2 mb-6">
              {/*<tool.icon className="h-6 w-6 text-purple-600" />*/}
              {/*<h2 className="text-lg font-semibold text-gray-900">{tool.title}</h2>*/}
            </div>

            <div className="space-y-1">

              {port.sections?.map((section, index) => {


                return (
                    <Link

                        to={`/ports/${portId}/${section.id}`}

                        key={section.id}

                        onClick={() => {

                          setSectionIndex(index);

                          navigate(`/ports/${portId}/${section.id}`, { replace: true })
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

            {/*{tool.premiumSections && (*/}
            {/*    <div className="mt-6 pt-6 border-t border-gray-200">*/}
            {/*      <div className="flex items-center gap-2 px-4 mb-2">*/}
            {/*        <Lock className="h-4 w-4 text-purple-600" />*/}
            {/*        <span className="text-sm font-medium text-gray-700">Premium Content</span>*/}
            {/*      </div>*/}
            {/*      <div className="space-y-1">*/}
            {/*        {tool.premiumSections.map((section) => (*/}
            {/*            <Link*/}
            {/*                key={section.id}*/}
            {/*                to="/premium"*/}
            {/*                className="block px-4 py-2 text-gray-400 hover:bg-gray-50 rounded-md"*/}
            {/*            >*/}
            {/*              {section.title}*/}
            {/*              <ChevronRight className="inline h-4 w-4 ml-1" />*/}
            {/*            </Link>*/}
            {/*        ))}*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*)}*/}
          </div>
        </nav>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Network className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Port {port.port} - {port.service}</h1>
              <p className="text-gray-500">Protocol: {port.protocol.toUpperCase()}</p>
            </div>
          </div>

          <div className="prose max-w-none">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-700">{port.description}</p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Default State</h2>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                port.defaultState === 'open'
                  ? 'bg-green-100 text-green-800'
                  : port.defaultState === 'filtered'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {port.defaultState.charAt(0).toUpperCase() + port.defaultState.slice(1)}
              </div>
            </div>

            {port.commands && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Common Commands</h2>
                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                  {codeBlockAndExplanation}
                </div>
              </div>
            )}

            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">Security Considerations</h2>
              <ul className="list-disc list-inside text-blue-800 space-y-2">
                <li>Always scan this port as part of security assessments</li>
                <li>Check for version-specific vulnerabilities</li>
                <li>Verify access controls and authentication mechanisms</li>
                <li>Monitor for unusual traffic patterns</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}