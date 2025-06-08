import {Award, Brain, Target} from "lucide-react";

export default function HomeCertificationSection() {
    return <div className=" py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Certification Paths</h2>
            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
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
                            <a href="/tests/ejpt" className="text-purple-600 hover:text-purple-800 font-medium">
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
                            <a href="/tests/cpts" className="text-purple-600 hover:text-purple-800 font-medium">
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
                            <a href="/tests/oscp" className="text-purple-600 hover:text-purple-800 font-medium">
                                View Study Path →
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}
