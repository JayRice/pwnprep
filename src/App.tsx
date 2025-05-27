import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate  } from 'react-router-dom';
import Navbar from './components/Navbar';
import TopicNav from './components/TopicNav';
import TargetParamsModal from './components/TargetParamsModal';
import ToolPage from './components/ToolPage';
// import PortPage from './components/PortPage';
import Home from './components/Home';
import Premium from './components/Premium';
import { Settings } from 'lucide-react';
import NoteTaker from "./components/NoteTaker.tsx";



import {
  loginWithEmail,
  loginWithGoogle,
  registerWithEmail,
  resetPassword,
  signOut,
  useAuthListener
} from './database/firebase.ts'
import {response} from "express";



function App() {
  const [user, setUser] = useState<import('firebase/auth').User | null>(null)
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [loading, setLoading] = useState(true);





  useAuthListener(u =>
  {
    console.log("User changed: ", u)
    setUser(u);
    setLoading(false);

  })

  const [isParamsModalOpen, setIsParamsModalOpen] = useState(false);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (loading){
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  }
  return (
    <Router>

      <div className="min-h-screen bg-gray-50" >
        <Navbar setUser={setUser} user={user}/>
        <TopicNav />
        <div className="pt-28">
          <button
            onClick={() => setIsParamsModalOpen(true)}
            className="fixed bottom-4 right-4 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition"
          >
            <Settings className="h-6 w-6" />
          </button>
          <TargetParamsModal
            isOpen={isParamsModalOpen}
            onClose={() => setIsParamsModalOpen(false)}
          />
        </div>
        <Routes>
          <Route path="/" element={<Home user={user}/>}  />
          <Route path="/premium" element={<Premium />} />

          <Route path="/tools/:toolId/:sectionId" element={<ToolPage type={"tool"} />} />
          <Route path="/tools/:toolId" element={<Navigate to="overview" replace />} />

          <Route path="/ports/:toolId" element={<Navigate to="common-ports" replace />} />
          <Route path="/ports/:toolId/:sectionId" element={<ToolPage type={"port"}/>} />

          <Route path="/notes" element={<NoteTaker user={user} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;