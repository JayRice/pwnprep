import { useState } from 'react';
import { Search } from 'lucide-react';
import { tools } from '../data/routes';
import { commonPorts } from '../data/ports';
import  certifications from "../data/certifications.ts"

import {Certification} from "../data/interfaces.ts"



interface Props {
  onSelect: (path: string) => void;
  variant?: 'default' | 'large';
  classNames?: string;
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  path: string;
  icon?: any;
  type: 'tool' | 'certification' | 'port';
}

export default function SearchBar({ onSelect, variant = 'default', classNames="" }: Props) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Combine all searchable items
  const searchResults: SearchResult[] = [
    ...tools.map(tool => ({
      ...tool,
      type: 'tool' as const
    })),
    // ...certifications.map(cert => ({
    //   ...cert,
    //   type: 'certification' as const
    // })),
    ...commonPorts.map(port => ({
      id: `port-${port.port}`,
      title: `${port.service} (Port ${port.port})`,
      description: port.description,
      path: `/ports/${port.port}`,
      type: 'port' as const
    })),


      ...certifications.map((cert : Certification) => ({
        ...cert,
        type: 'certification' as const
      }))
  ];

  const filteredResults = query
    ? searchResults.filter((result) =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.description.toLowerCase().includes(query.toLowerCase()) ||
        (result.type === 'port' && result.title.includes(query))
      )
    : [];

  const handleSelect = (path: string) => {
    onSelect(path);
    setQuery('');
    setIsOpen(false);
  };

  const inputClasses = variant === 'large'
    ? 'w-full px-6 py-4 text-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
    : 'w-full px-4 py-2 text-gray-900 bg-white rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500';

  const searchIconClasses = variant === 'large'
    ? 'absolute left-4 top-4 h-6 w-6 text-gray-400'
    : 'absolute left-3 top-2.5 h-5 w-5 text-gray-400';

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'tool':
        return 'bg-purple-100 text-purple-800';
      case 'certification':
        return 'bg-blue-100 text-blue-800';
      case 'port':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={"relative " + classNames}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search tools, certifications, and ports..."
          className={`pl-14 ${inputClasses}`}
        />
        <Search className={searchIconClasses} />
      </div>

      {isOpen && query && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg max-h-96 overflow-y-auto">
          {filteredResults.length > 0 ? (
            <ul className="py-1">
              {filteredResults.map((result) => (
                <li key={result.id}>
                  <button
                    onClick={() => handleSelect(result.path)}
                    className="w-full px-4 py-3 text-left hover:bg-purple-50"
                  >
                    <div className="flex items-center gap-2">
                      {result.icon && <result.icon className="h-5 w-5 text-purple-600" />}
                      <div className="flex-1">
                        <div className="text-gray-900 font-medium">{result.title}</div>
                        <div className="text-sm text-gray-500">{result.description}</div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(result.type)}`}>
                        {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}