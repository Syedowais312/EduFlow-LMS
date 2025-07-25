'use client';
import React, { useState, useEffect } from 'react';
import { Users, FileText, ArrowRight, CheckCircle, Award, Zap } from 'lucide-react';

export default function StarterPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    { icon: FileText, title: "Smart Assignments", desc: "Create and manage assignments with intelligent tracking" },
    { icon: Users, title: "Seamless Collaboration", desc: "Connect teachers and students in one unified platform" },
    { icon: CheckCircle, title: "Instant Feedback", desc: "Real-time submission status and grading system" },
    { icon: Award, title: "Progress Analytics", desc: "Track performance with detailed insights and reports" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden relative">
      {/* Hero Section */}
      <div className={`relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/20">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm">Revolutionizing Education Technology</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
            Where Learning
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
              Meets Innovation
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Transform your classroom experience with our cutting-edge platform that seamlessly connects teachers and students through intelligent assignment management.
          </p>
        </div>
      </div>

      {/* CTA Button */}
      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
        <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full font-semibold text-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 hover:scale-105 shadow-2xl shadow-purple-500/25 overflow-hidden">
          <span className="relative z-10 flex items-center">
            Get Started
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </div>

      {/* Features Section */}
      <div className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Powerful Features for{' '}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Modern Education</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Everything you need to create an engaging learning environment
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:border-purple-500/50"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm rounded-3xl p-12 border border-white/10">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Your Classroom?
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Join thousands of educators who are already using EduFlow to enhance their teaching experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 hover:scale-105">
                Start Free Trial
              </button>
              <button className="px-8 py-4 border border-white/20 rounded-full font-semibold hover:bg-white/10 transition-all duration-300 hover:scale-105">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
