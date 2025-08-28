"use client"
import Image from "next/image";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";

import StarterPage from "./components/StarterPage";
import TeacherContent from "./components/TeacherContent";
import StudentContent from "./components/StudentContent";

export default function Home() {
  const [user, setUser] = useState(null);

 useEffect(() => {
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  } catch (err) {
    console.error("Invalid JSON in localStorage.user:", err);
    localStorage.removeItem("user"); // clear bad value so it doesn’t crash again
  }
}, []);
  const handleLogout = () => {
    localStorage.removeItem("user"); // clear from storage
    setUser(null); // reset state
  };

  console.log("user:", user);

  return (
    <div className="bg-white-100 min-h-screen">
     <Navbar 
  handleLogout={handleLogout} 
  user={user} 
  role={user ? user.role : null} 
/>
     {user ? (
  user.role === "teacher" ? (
    <TeacherContent />
  ) : (
    <StudentContent user={user}/>
  )
) : (
  <StarterPage />
)}

    </div>
  );
}
