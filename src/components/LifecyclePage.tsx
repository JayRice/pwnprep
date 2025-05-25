import React from 'react';
import { useParams } from 'react-router-dom';
import { lifecyclePhases } from '../data/routes';
import { Target } from 'lucide-react';
import CodeBlock from './CodeBlock';
import { Toaster } from 'react-hot-toast';

export default function LifecyclePage() {
  const { phaseId } = useParams();
  const phase = lifecyclePhases.find(p => p.id === phaseId);

  if (!phase) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Phase not found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Toaster position="bottom-right" />
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{phase.title}</h1>
              <p className="text-gray-500">{phase.description}</p>
            </div>
          </div>

          <div className="prose max-w-none">
            {phase.sections.map(section => (
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
          </div>
        </div>
      </div>
    </div>
  );
}