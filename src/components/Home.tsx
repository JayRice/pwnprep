import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import { Settings, BookOpen, Target, Award, Brain, Terminal, Shield, Code, CheckCircle2 } from 'lucide-react';

import WelcomePage from './WelcomePage';

const ValueProposition = () => (
  <div className="bg-white py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose PwnPrep?</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your all-in-one platform for mastering cybersecurity certifications and penetration testing tools.
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
            Structured learning paths designed specifically for eJPT, CPTS, Security+, and OSCP certifications. Know exactly what to study.
          </p>
        </div>
        
        <div className="bg-purple-50 rounded-xl p-6">
          <Code className="h-8 w-8 text-purple-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Practical Tools</h3>
          <p className="text-gray-600">
            Access a comprehensive collection of penetration testing tools and commands, with real-world examples and use cases.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="md:flex items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h3 className="text-2xl font-bold mb-2">Unlock Your Full Potential with Premium</h3>
            <p className="text-purple-100">
              Get access to complete certification paths, interactive labs, private walkthroughs, and more.
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-2" />
                <span>Step-by-step certification guides</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-2" />
                <span>Interactive practice environments</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-2" />
                <span>Private walkthrough videos</span>
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

const CertificationSection = () => (
  <div className="bg-gray-50 py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Certification Paths</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition hover:scale-105">
          <div className="p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">eJPT</h3>
            <p className="text-gray-600 mb-4">eLearnSecurity Junior Penetration Tester</p>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-2">•</span>
                <span>Practical penetration testing</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-2">•</span>
                <span>Network attacks</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-2">•</span>
                <span>Web applications</span>
              </div>
            </div>
            <div className="mt-6">
              <a href="/premium" className="text-purple-600 hover:text-purple-800 font-medium">
                View Study Path →
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition hover:scale-105">
          <div className="p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Award className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">CPTS</h3>
            <p className="text-gray-600 mb-4">Certified Penetration Testing Specialist</p>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-2">•</span>
                <span>Advanced exploitation</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-2">•</span>
                <span>Active Directory</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-2">•</span>
                <span>Privilege escalation</span>
              </div>
            </div>
            <div className="mt-6">
              <a href="/premium" className="text-purple-600 hover:text-purple-800 font-medium">
                View Study Path →
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition hover:scale-105">
          <div className="p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Security+</h3>
            <p className="text-gray-600 mb-4">CompTIA Security+ Certification</p>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-2">•</span>
                <span>Security fundamentals</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-2">•</span>
                <span>Network security</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-2">•</span>
                <span>Compliance</span>
              </div>
            </div>
            <div className="mt-6">
              <a href="/premium" className="text-purple-600 hover:text-purple-800 font-medium">
                View Study Path →
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition hover:scale-105">
          <div className="p-6">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <Brain className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">OSCP</h3>
            <p className="text-gray-600 mb-4">Offensive Security Certified Professional</p>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-2">•</span>
                <span>Advanced penetration testing</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-2">•</span>
                <span>Exploit development</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-2">•</span>
                <span>Report writing</span>
              </div>
            </div>
            <div className="mt-6">
              <a href="/premium" className="text-purple-600 hover:text-purple-800 font-medium">
                View Study Path →
              </a>
            </div>
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
  user: user | null
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
          <CertificationSection />
          <TopicsSection />
        </div>
    );
  }


}