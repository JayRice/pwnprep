import  {useEffect, useState} from 'react';
import {  Routes, Route, Navigate  } from 'react-router-dom';
import Navbar from './components/Navbar';
import TopicNav from './components/TopicNav';
import Home from './components/Home';
import Premium from './components/Premium';
import NoteTaker from "./components/NoteTaker.tsx";
import CertificationPage from "./components/Certification.tsx";
import ActionNavbar from "./components/ActionNavbar.tsx"
import ProfilePage from "./components/ProfilePage.tsx"
import LoadingSpinner from "./components/LoadingSpinner.tsx"
import Success from "./components/Success";
import {isPremium} from "./database/database.ts";

import {Toaster} from "react-hot-toast";



import {
  useAuthListener
} from './database/firebase.ts'
import {useStore} from "./store/useStore.ts";


type FormProps = {

  user: import('firebase/auth').User | null;
  className?: string
};

function Form({user, className=""}: FormProps) {



  return (<form action="https://formspree.io/f/movwepjz"
                method="POST"
                className={"h-full w-[60%] mx-auto justify-center flex flex-col gap-4 p-20 rounded-md " + className}>
    <p className={"text-2xl font-light"}> Have any questions or concerns? </p>
    <p className={"font-light text-xl"}>We'll solve them for you in 24 to 48 business hours.</p>

    <div className={"flex flex-col gap-4 text-gray-600"}>
      <input className={"hidden"} name={"UserUID"} value={user ? user.uid:"guest"}></input>
      <input  required={true} placeholder="Name" name="Name" className={"w-full h-[50px] border-2 border-gray-800 p-2"}/>
      <input required={true} placeholder="Email" name={"Email"} type={"email"} className={"w-full h-[50px] border-2  border-gray-800 p-2"}/>
      <textarea required={true} placeholder={"Message"} name={"Message"} className={"border-2  min-h-[20vh] border-2 border-gray-800 p-2"}></textarea>
      <button type={"submit"} className={"hover:bg-gray-800 hover:text-white h-12 border-2 border-gray-800 transition   "} >Submit</button>
    </div>

  </form> )
}
const AboutPage = () => {
  return (
      <div className="w-full max-w-3xl mx-auto mt-16 px-4 text-black font-light">
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


  const [actionBarToggled, setActionBarToggled] = useState<boolean>(false);


  const setPremium = useStore((store) => store.setIsPremium);

  useEffect(() => {
    if (!user) return;
    isPremium().then((response) => {
      setPremium(response);
    });
  }, [user]);



  useAuthListener(u =>
  {
    setUser(u);
    setLoading(false);

  })

  const [isParamsModalOpen, setIsParamsModalOpen] = useState(false);



  if (loading){
    return <LoadingSpinner parentClassName={"items-center w-full h-[100vh]"} spinnerClassName={"bg-purple-600"} />
  }
  return (
    <div>

      <div className="min-h-screen bg-gray-50 mt-[6rem] overflow-x-hidden" >
        <Toaster position={"bottom-right"}></Toaster>
        <Navbar user={user} premium={useStore.getState().isPremium}/>
        <TopicNav />

        <ActionNavbar user={user} setIsParamsModalOpen={setIsParamsModalOpen} isParamsModalOpen={isParamsModalOpen} isToggled={actionBarToggled}
        setIsToggled={setActionBarToggled}/>



        <Routes>
          <Route path="/" element={<Home />}  />
          <Route path="/home" element={<Home />}  />

          <Route path="/about" element={<AboutPage />}  />

          <Route path={"/contact"} element={<Form user={user} className={"flex justify-center w-full"}/>} />

          <Route path={"/success"} element={<Success />}  />

          <Route path="/premium" element={<Premium user={user}/>} />

          {/*<Route path="/tools/:toolId/:sectionId" element={<ToolPage type={"tool"} />} />*/}
          {/*<Route path="/tools/:toolId" element={<Navigate to="overview" replace />} />*/}

          {/*<Route path="/ports/:toolId" element={<Navigate to="common-ports" replace />} />*/}
          {/*<Route path="/ports/:toolId/:sectionId" element={<ToolPage type={"port"}/>} />*/}

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