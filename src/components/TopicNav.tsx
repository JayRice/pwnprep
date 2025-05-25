import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { commonPorts } from '../data/ports';
import { ChevronDown } from 'lucide-react';

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

export default function TopicNav() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const dropdownRefPorts = useRef<HTMLDivElement>(null);
  const dropdownRefTools = useRef<HTMLDivElement>(null);

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
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

  return (
    <div className="fixed top-16 left-0 right-0 bg-gray-900 text-white z-40" >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center space-x-8 h-12">
          {/* Non-collapsible items */}
          <Link
            to="/tools/shells"
            className="text-sm hover:text-purple-400 transition-colors"
          >
            SHELLS
          </Link>
          <Link
            to="/tools/privesc"
            className="text-sm hover:text-purple-400 transition-colors"
          >
            PRIVESC
          </Link>
          <Link
            to="/tools/persistence"
            className="text-sm hover:text-purple-400 transition-colors"
          >
            PERSISTENCE
          </Link>
          <Link
            to="/lifecycle"
            className="text-sm hover:text-purple-400 transition-colors"
          >
            LIFE CYCLE
          </Link>

          <Link
              to="/notes"
              className="text-sm hover:text-purple-400 transition-colors"
          >
            NOTE TAKER
          </Link>

          {/* Ports Dropdown */}
          <div className="relative group" ref={dropdownRefPorts}>
            <button
              onClick={() => toggleSection('ports')}
              className="flex items-center space-x-1 text-sm hover:text-purple-400 transition-colors"
            >
              <span>PORTS</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {openSections['ports'] && (
              <div className="absolute left-0 mt-2 w-96 bg-gray-800 rounded-md shadow-lg py-2 z-50 overflow-y-auto max-h-64">
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
              className="flex items-center space-x-1 text-sm hover:text-purple-400 transition-colors"
            >
              <span>TOOLS</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {openSections['tools'] && (
              <div className="absolute left-0 mt-2 w-64 bg-gray-800 rounded-md shadow-lg py-2 z-50 overflow-y-auto max-h-64">
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
        </div>
      </div>
    </div>
  );
}