import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import HomeCertificationSection from "./HomeCertificationSection.tsx"
import {Award, Target, Terminal} from "lucide-react"
export default function WelcomePage() {
    const navigate = useNavigate();

    return (
        <div className="">
            <div className=" mx-auto min-w-[calc(100vw-1rem)]">
                <div className={"min-h-[calc(100vh-4rem)] bg-gradient-to-b from-gray-900 to-purple-900 flex flex-col items-center justify-center text-white "}>
                    <div className="text-center mb-12">
                        <h1 className="text-6xl font-bold  mb-4">Welcome!</h1>
                        <p className="text-3xl ">Continue your cybersecurity journey</p>
                    </div>
                    <div className=" mx-auto mb-4 w-[40%]">
                        <h2 className="text-xl font-semibold  mb-4">Quick Search</h2>
                        <SearchBar onSelect={(path) => navigate(path)} variant="large" />
                    </div>
                </div>


                <HomeCertificationSection/>

                {/*<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">*/}
                {/*    <div className="bg-white rounded-xl shadow-lg p-6">*/}
                {/*        <div className="flex items-center gap-4 mb-4">*/}
                {/*            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">*/}
                {/*                <Terminal className="h-6 w-6 text-purple-600" />*/}
                {/*            </div>*/}
                {/*            <h2 className="text-xl font-semibold">Recent Tools</h2>*/}
                {/*        </div>*/}
                {/*        <div className="space-y-3">*/}
                {/*            <a href="/tools/nmap" className="block p-3 rounded-lg hover:bg-gray-50">*/}
                {/*                <div className="font-medium text-gray-900">Nmap</div>*/}
                {/*                <div className="text-sm text-gray-500">Network scanning and enumeration</div>*/}
                {/*            </a>*/}
                {/*            <a href="/tools/privesc" className="block p-3 rounded-lg hover:bg-gray-50">*/}
                {/*                <div className="font-medium text-gray-900">Privilege Escalation</div>*/}
                {/*                <div className="text-sm text-gray-500">System privilege escalation techniques</div>*/}
                {/*            </a>*/}
                {/*        </div>*/}
                {/*    </div>*/}


                {/*    <div className="bg-white rounded-xl shadow-lg p-6">*/}
                {/*        <div className="flex items-center gap-4 mb-4">*/}
                {/*            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">*/}
                {/*                <Target className="h-6 w-6 text-green-600" />*/}
                {/*            </div>*/}
                {/*            <h2 className="text-xl font-semibold">Quick Actions</h2>*/}
                {/*        </div>*/}
                {/*        <div className="space-y-3">*/}
                {/*            <button*/}
                {/*                onClick={() => navigate('/tools/shells')}*/}
                {/*                className="w-full text-left p-3 rounded-lg hover:bg-gray-50"*/}
                {/*            >*/}
                {/*                <div className="font-medium text-gray-900">Generate Shell</div>*/}
                {/*                <div className="text-sm text-gray-500">Create custom reverse shells</div>*/}
                {/*            </button>*/}
                {/*            <button*/}
                {/*                onClick={() => navigate('/tools/privesc')}*/}
                {/*                className="w-full text-left p-3 rounded-lg hover:bg-gray-50"*/}
                {/*            >*/}
                {/*                <div className="font-medium text-gray-900">Privilege Escalation</div>*/}
                {/*                <div className="text-sm text-gray-500">System enumeration checklist</div>*/}
                {/*            </button>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}


                {/*<div className="bg-white rounded-xl shadow-lg p-6 mb-12">*/}
                {/*    <div className="flex items-center gap-4 mb-6">*/}
                {/*        <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">*/}
                {/*            <Award className="h-6 w-6 text-purple-600" />*/}
                {/*        </div>*/}
                {/*        <h2 className="text-xl font-semibold">Recommended Path</h2>*/}
                {/*    </div>*/}
                {/*    <div className="space-y-4">*/}
                {/*        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">*/}
                {/*            <div className="flex-1">*/}
                {/*                <h3 className="font-medium text-gray-900">Complete Network Enumeration</h3>*/}
                {/*                <p className="text-sm text-gray-500">Master the basics of network scanning and enumeration</p>*/}
                {/*            </div>*/}
                {/*            <button*/}
                {/*                onClick={() => navigate('/tools/nmap')}*/}
                {/*                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"*/}
                {/*            >*/}
                {/*                Start*/}
                {/*            </button>*/}
                {/*        </div>*/}
                {/*        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">*/}
                {/*            <div className="flex-1">*/}
                {/*                <h3 className="font-medium text-gray-900">Web Application Security</h3>*/}
                {/*                <p className="text-sm text-gray-500">Learn about common web vulnerabilities and exploitation</p>*/}
                {/*            </div>*/}
                {/*            <button*/}
                {/*                onClick={() => navigate('/tools/xss')}*/}
                {/*                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"*/}
                {/*            >*/}
                {/*                Start*/}
                {/*            </button>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}




            </div>
        </div>
    );
}