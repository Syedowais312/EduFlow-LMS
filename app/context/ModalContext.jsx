"use client"
import React, { useState, createContext, useContext, useEffect } from 'react'
import { authService } from '../services/authService'

const ModalContext = createContext();

export default function ModalProvider({ children }) {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [isTeacher, setIsTeacher] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing authentication on component mount
  useEffect(() => {
    const userData = authService.getUserData();
    if (userData) {
      setUser(userData.user);
      setIsTeacher(userData.user.role === 'teacher');
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      authService.storeUserData(response.token, response.user);
      setUser(response.user);
      setIsTeacher(response.user.role === 'teacher');
      setShowModal(false);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Signup function
  const signup = async (userData) => {
    try {
      const response = await authService.signup(userData);
      authService.storeUserData(response.token, response.user);
      setUser(response.user);
      setIsTeacher(response.user.role === 'teacher');
      setShowModal(false);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    authService.clearUserData();
    setUser(null);
    setIsTeacher(false);
  };

  return (
    <ModalContext.Provider value={{ 
      showModal, 
      setShowModal, 
      user, 
      setUser, 
      isTeacher, 
      setIsTeacher, 
      isLoading,
      login,
      signup,
      logout
    }}>
      {children}
    </ModalContext.Provider>
  )
}

export function useModal() {
  return useContext(ModalContext);
}
