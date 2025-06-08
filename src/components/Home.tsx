import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import { Terminal, Shield, Code, CheckCircle2 } from 'lucide-react';

import WelcomePage from './WelcomePage';

import HomeCertificationSection from "./HomeCertificationSection.tsx"


const ValueProposition = () => (
  <div className="bg-white py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose PwnPrep?</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your all-in-one platform for acing cybersecurity certification tests and remembering penetration testing tools and commands.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-purple-50 rounded-xl p-6">
          <Terminal className="h-8 w-8 text-purple-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Command Center</h3>
          <p className="text-gray-600">
            Input your target parameters once and automatically populate them across all tool commands. Save time and avoid repetitive typing.
          </p>
        </div>
        
        <div className="bg-purple-50 rounded-xl p-6">
          <Shield className="h-8 w-8 text-purple-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Exam-Focused Learning</h3>
          <p className="text-gray-600">
            Structured command documentation for eJPT, CPTS, and OSCP certifications with AI help for any command. Know exactly what to study.
          </p>
        </div>
        
        <div className="bg-purple-50 rounded-xl p-6">
          <Code className="h-8 w-8 text-purple-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Practical Tools</h3>
          <p className="text-gray-600">
            Access a comprehensive collection of penetration testing tools and commands.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="md:flex items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h3 className="text-2xl font-bold mb-2">Unlock Your Full Potential with Premium</h3>
            <p className="text-purple-100">
              Get access to complete certification paths, unlimited AI uses and explanations, and much more!
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-2" />
                <span>Step-by-step certification guides</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-2" />
                <span>Interactive AI to help when confused</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-2" />
                <span>Efficently take notes with AI organization</span>
              </li>
            </ul>
          </div>
          <div className="text-center md:text-right">
            <a 
              href="/premium"
              className="inline-block px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition"
            >
              Upgrade to Premium
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
);


const TopicsSection = () => (
  <div id="topics" className="bg-white py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-2 bg-red-500"></div>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Reconnaissance
            </h2>
            <ul className="space-y-2">
              <li>
                <a href="/tools/nmap" className="text-purple-600 hover:text-purple-800">
                  Nmap Basics →
                </a>
              </li>
              <li>
                <a href="/tools/osint" className="text-purple-600 hover:text-purple-800">
                  OSINT Techniques →
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-2 bg-blue-500"></div>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Exploitation
            </h2>
            <ul className="space-y-2">
              <li>
                <a href="/tools/sqli" className="text-purple-600 hover:text-purple-800">
                  SQL Injection →
                </a>
              </li>
              <li>
                <a href="/tools/xss" className="text-purple-600 hover:text-purple-800">
                  Cross-Site Scripting →
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-2 bg-green-500"></div>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Post Exploitation
            </h2>
            <ul className="space-y-2">
              <li>
                <a href="/tools/privesc" className="text-purple-600 hover:text-purple-800">
                  Privilege Escalation →
                </a>
              </li>
              <li>
                <a href="/tools/persistence" className="text-purple-600 hover:text-purple-800">
                  Maintaining Access →
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
);

interface HomeProps{
  user: import('firebase/auth').User | null;
}

export default function Home({user}: HomeProps) {
  const navigate = useNavigate();

  const handleSearch = (path: string) => {
    navigate(path);
  };

  const userVerified = user && user.emailVerified;

  if (userVerified){
    return (<WelcomePage/>);
  }else{
    return (
        <div>
          <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-gray-900 to-purple-900 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-6xl font-bold text-white mb-4">
              Learn Cybersecurity
            </h1>
            <p className="text-xl text-purple-200 mb-8">
              With the world's most comprehensive penetration testing tutorials.
            </p>
            <div className="w-full max-w-2xl">
              <SearchBar onSelect={handleSearch} variant="large" />
            </div>
            <a href="#value-prop" className="mt-8 text-purple-200 hover:text-white">
              Learn More
            </a>
          </div>
          <div id="value-prop">
            <ValueProposition />
          </div>
          <HomeCertificationSection />
          <TopicsSection />
        </div>
    );
  }


}