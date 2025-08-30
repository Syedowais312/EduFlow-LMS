"use client"
import React, { useState,useEffect } from 'react';
import Link from 'next/link';
import { useModal } from '../context/ModalContext';
import { BookOpen, Search, Bell, Settings, User, LogOut } from 'lucide-react';
import { useRouter } from "next/navigation";
export default function Navbar() {
  const [isLogin, setisLogin] = useState(false);
      const [user, setUser] = useState(null);
    const router = useRouter();
     useEffect(() => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error("Invalid JSON in localStorage.user:", err);
        localStorage.removeItem("user");
      }
    }, []);
      const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        router.push("/mainpage");
         // reset state
      };
    
  
  return (
    
    <nav className="fixed top-0 z-50 w-full bg-white/5 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto flex flex-wrap justify-between items-center p-4">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          {user ? (
            <div className="flex flex-col">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              {user.role==="teacher"?"Teacher":"Student"}
             
            </span>
             {user.role==="teacher"?(
               <p className="text-sm text-grey-600">prof. {user.firstname}</p>
           
             ):(
               <p className="text-sm text-grey-600">ft. {user.firstname}</p>
           
             )}
             
            </div>
          ) : (
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 bg-clip-text text-transparent">
              EduFlow
            </span>
          )}
        </div>

        {/* Right Side */}
        {user ? (
          <div className="mt-4 md:mt-0 flex items-center gap-4 flex-wrap">
           <div className="relative w-64 hidden sm:block">
  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
  <input
    type="text"
    placeholder="Search assignments..."
    className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
  />
</div>


            <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>

           
            <button className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/25"
            onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="mt-4 md:mt-0 flex gap-3 flex-wrap">
           
            <button className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-700 via-blue-600 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/25"
            onClick={() => setShowModal(true)}>
              Sign Up
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
