import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';




export default function TopicNav() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const dropdownRefPorts = useRef<HTMLDivElement>(null);
  const dropdownRefTools = useRef<HTMLDivElement>(null);


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
            to="/premium"
            className="text-sm hover:text-purple-400 transition-colors"
          >
            PRICING
          </Link>
          <Link
              to="/about"
              className="text-sm hover:text-purple-400 transition-colors"
          >
            ABOUT
          </Link>
          <Link
              to="/howto"
              className="text-sm hover:text-purple-400 transition-colors"
          >
            HOW TO
          </Link>
          <Link
              to="/contact"
              className="text-sm hover:text-purple-400 transition-colors"
          >
            CONTACT
          </Link>




        </div>
      </div>
    </div>
  );
}