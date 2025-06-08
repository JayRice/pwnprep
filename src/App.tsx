import  {useEffect, useState} from 'react';
import {  Routes, Route, Navigate  } from 'react-router-dom';
import Navbar from './components/Navbar';
import TopicNav from './components/TopicNav';
import ToolPage from './components/ToolPage';
import Home from './components/Home';
import Premium from './components/Premium';
import NoteTaker from "./components/NoteTaker.tsx";
import CertificationPage from "./components/Certification.tsx";
import ActionNavbar from "./components/ActionNavbar.tsx"
import ProfilePage from "./components/ProfilePage.tsx"
import Success from "./components/Success";
import {isPremium} from "./database/database.ts";

import {Toaster} from "react-hot-toast";


import {
  useAuthListener
} from './database/firebase.ts'


type FormProps = {

  className?: string
};

function Form({className=""}: FormProps) {



  return (<form action="https://formspree.io/f/mjkwjnzq"
                method="POST"
                className={"min-xl:w-[50vw] w-[75vw] h-full  flex flex-col gap-4 p-20  " + className}>

    <input  placeholder="Name" name="Name" className={"w-full h-[50px] border-2 border-project- bg-project"}/>
    <input placeholder="Email" name={"Email"} type={"email"} className={"w-full h-[50px] border-2 border-project-light bg-project"}/>
    <textarea placeholder={"Message"} name={"Message"} className={"border-2 border-project-light min-h-[20vh] bg-project"}></textarea>
    <button type={"submit"} className={"hover:brightness-90 bg-project h-10"} >Submit</button>
  </form> )
}
const AboutPage = () => {
  return (
      <div className="w-full max-w-3xl mx-auto mt-32 px-4 text-black font-light">
        <h1 className="text-4xl font-bold text-center mb-6">About PwnPrep</h1>

        <p className="text-xl mb-4">
          PwnPrep is a tool I built as a cybersecurity student who got tired of constantly editing and retyping the same commands — like replacing IPs in <code className="bg-gray-800 px-2 py-1 rounded text-white">nmap [IP]</code> every time I worked on a lab or study material.
          It’s designed to remove that friction and make note-taking and test prep smoother and more efficient.
        </p>

        <p className="text-xl mb-4">
          The app helps you organize your commands, tools, and techniques by automatically replacing target variables like IPs and ports, so you can focus on learning instead of copy-pasting and editing. You can take notes, store payloads, and explore curated tips for certifications like the eJPT, CPTS, OSCP, and others.
        </p>

        <p className="text-xl mb-4">
          There’s also a Premium version available if you want more. It includes full access to all command sets for multiple certifications, unlimited AI usage to help explain topics or organize your notes, and upcoming features like custom AI-powered note tagging and expanded test prep support.
        </p>

        <p className="text-xl">
          Whether you’re just getting started or deep in your certification journey, PwnPrep is meant to be a lightweight, focused companion that saves you time and keeps your workflow clean.
        </p>
      </div>
  );
};


function App() {
  const [user, setUser] = useState<import('firebase/auth').User | null>(null)
  const [loading, setLoading] = useState(true);

  const [premium, setPremium] = useState(false);

  const [actionBarToggled, setActionBarToggled] = useState<boolean>(false);






  useAuthListener(u =>
  {
    setUser(u);
    setLoading(false);

  })
  useEffect(() => {
    isPremium().then((response:boolean) => {
      setPremium(response);
    });
  }, []);

  const [isParamsModalOpen, setIsParamsModalOpen] = useState(false);

  // const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  //
  // const toggleSection = (section: string) => {
  //   setOpenSections(prev => ({
  //     ...prev,
  //     [section]: !prev[section]
  //   }));
  // };

  if (loading){
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  }
  return (
    <div>

      <div className="min-h-screen bg-gray-50 mt-[6rem]" >
        <Toaster position={"bottom-right"}></Toaster>
        <Navbar user={user} premium={premium}/>
        <TopicNav />

        <ActionNavbar user={user} setIsParamsModalOpen={setIsParamsModalOpen} isParamsModalOpen={isParamsModalOpen} isToggled={actionBarToggled}
        setIsToggled={setActionBarToggled}/>



        <Routes>
          <Route path="/" element={<Home user={user}/>}  />
          <Route path="/home" element={<Home user={user}/>}  />

          <Route path="/about" element={<AboutPage />}  />

          <Route path={"/contact"} element={<Form className={"flex justify-center w-full"}/>} />

          <Route path={"/success"} element={<Success />}  />

          <Route path="/premium" element={<Premium user={user}/>} />

          <Route path="/tools/:toolId/:sectionId" element={<ToolPage type={"tool"} />} />
          <Route path="/tools/:toolId" element={<Navigate to="overview" replace />} />

          <Route path="/ports/:toolId" element={<Navigate to="common-ports" replace />} />
          <Route path="/ports/:toolId/:sectionId" element={<ToolPage type={"port"}/>} />

          <Route path="/notes" element={<NoteTaker user={user} actionBarToggled={actionBarToggled} />} />


          <Route path="/tests/:certId" element={<Navigate to="overview" replace />} />
          <Route path="/tests/:certId/:sectionId" element={<CertificationPage />} />

          <Route path="/profile" element={<ProfilePage user={user}/>}/>

        </Routes>
      </div>
    </div>
  );
}

export default App;