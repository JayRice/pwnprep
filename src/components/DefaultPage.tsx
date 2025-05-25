import React from 'react';
import { Terminal } from 'lucide-react';
import CodeBlock from './CodeBlock';
import { Toaster } from 'react-hot-toast';

interface Section {
  id: string;
  title: string;
  content: string;
  commands?: string[];
}

interface DefaultPageProps {
  title: string;
  description: string;
  sections: Section[];
}

export default function DefaultPage({ title, description, sections }: DefaultPageProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Toaster position="bottom-right" />
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Terminal className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              <p className="text-gray-500">{description}</p>
            </div>
          </div>

          <div className="prose max-w-none">
            {sections.map(section => (
              <div key={section.id} className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{section.title}</h2>
                <p className="text-gray-700 mb-6">{section.content}</p>
                
                {section.commands && (
                  <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                    {section.commands.map((command, index) => (
                      <CodeBlock key={index} code={command} />
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="bg-blue-50 p-6 rounded-lg mt-8">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">Additional Resources</h2>
              <ul className="list-disc list-inside text-blue-800 space-y-2">
                <li>Check the documentation for more details</li>
                <li>Join our community for support</li>
                <li>Practice in our interactive labs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}