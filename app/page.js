"use client"
import Image from "next/image";
import Navbar from "./components/Navbar";
import StarterPage from "./components/StarterPage";
import TeacherContent from "./components/TeacherContent";
import StudentContent from "./components/StudentContent";

export default function Home() {
  const user=true; // Change this to false if you want to see the home page(hard coded)
  const teacher=true;// Change this to true if you want to see the teacher dashboard(hard coded)
  return (
    
    <div className="bg-white-100 min-h-screen">
    <Navbar teacher={teacher}/>
    {!user?(<StarterPage/>):teacher?(<TeacherContent/>):(<StudentContent/>)}
    
     
    </div>
    
  );
}
