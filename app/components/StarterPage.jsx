"use client";
import {
  ArrowLeft,
  ArrowRight,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  School,
  BookOpen,
  GraduationCap,
  Users,
  FileText,
  CheckCircle,
  Award,
  Zap
} from "lucide-react";
import { useState, useEffect, createContext, useContext } from "react";
import { useRouter } from "next/navigation";

// Mock Modal Context (since the original context is not available)
const ModalContext = createContext();

const ModalProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);

  return (
    <ModalContext.Provider value={{
      showModal, setShowModal,
      user, setUser,
      isTeacher, setIsTeacher
    }}>
      {children}
    </ModalContext.Provider>
  );
};

const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

function StarterPage() {
    const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const { showModal, setShowModal } = useModal();
  const { user, setUser } = useModal();
  const { isTeacher, setIsTeacher } = useModal();
  const [isLogin, setIsLogin] = useState(false);

  const [selectedRole, setSelectedRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    school: "",
    grade: "",
    subject: "",
    experience: "",
  });
  const parseJSON = async (res) => {
  try {
    // Check if body exists before parsing
    const text = await res.text();
    return text ? JSON.parse(text) : {};
  } catch (err) {
    console.error("JSON parse error:", err);
    return {};
  }
};
// Update the HandleLogin function
const HandleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch(process.env.NEXT_PUBLIC_LOGIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password
      }),
    });

    const data = await parseJSON(res);

    if (data.token) {
      alert("Login Successfully");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setShowModal(false);
      
      // Redirect based on role
      const userRole = data.user.role;
      console.log(userRole);
      if (userRole === "teacher") {
        router.replace("/teacherpage");
      } else if (userRole === "student") {
        router.replace("/studentpage");
      }
    } else {
      alert("Login failed");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Network error occurred");
  }
};



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Update the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_SIGNUP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role: selectedRole }),
      });
      
      const data = await res.json();
      
      if (data.token) {
        alert("Signup Successfully");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setShowModal(false);
        
        // Redirect based on role
        const userRole = data.user.role;
        if (userRole === "teacher") {
          router.replace("/teacherpage");
        } else if (userRole === "student") {
          router.replace("/studentpage");
        }
      } else {
        alert("Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Network error occurred");
    }
   
    console.log("Signup Data:", formData);
    console.log("Selected Role:", selectedRole);

    
    // Set user state
    setUser(true);
    
    // Set teacher state based on selected role
    if (selectedRole === "teacher") {
      setIsTeacher(true);
      console.log("Setting as teacher");
    } else {
      setIsTeacher(false);
      console.log("Setting as student");
    }
    
    // Close modal after state is set
    setTimeout(() => {
      setShowModal(false);
    }, 100);
  };

  const handleGetStarted = () => {
    setShowModal(true);
  };

  const currentRole = selectedRole === "student"
    ? {
        title: "Student",
        icon: User,
        gradient: "from-blue-500 via-blue-700 to-blue-500",
      }
    : {
        title: "Teacher",
        icon: GraduationCap,
        gradient: "from-purple-900 via-purple-500 to-purple-900",
      };

  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Add this useEffect at the top of your StarterPage component
useEffect(() => {
  // Check if user is logged in
  const userStr = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  
  if (userStr && token) {
    try {
      const user = JSON.parse(userStr);
      // Redirect based on role
      if (user.user.role === "teacher") {
        router.push("/TeacherPage");
      } else {
        router.push("/StudentPage");
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      // Clear invalid data
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }
}, [router]); // Add router as dependency

  const features = [
    { icon: FileText, title: "Smart Assignments", desc: "Create and manage assignments with intelligent tracking" },
    { icon: Users, title: "Seamless Collaboration", desc: "Connect teachers and students in one unified platform" },
    { icon: CheckCircle, title: "Instant Feedback", desc: "Real-time submission status and grading system" },
    { icon: Award, title: "Progress Analytics", desc: "Track performance with detailed insights and reports" },
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900 text-white overflow-hidden relative">
        {/* Hero Section */}
        <div className={`relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/20">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm">Revolutionizing Education Technology</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
              Where Learning
              <span className="block bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
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
          <button 
            onClick={handleGetStarted}
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-700 to-blue-500 rounded-full font-semibold text-lg hover:from-blue-900 hover:to-blue-900 transition-all duration-300 hover:scale-105 shadow-2xl shadow-purple-500/25 overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>

        {/* Features Section */}
        <div className="relative z-10 py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                Powerful Features for{' '}
                <span className="bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">Modern Education</span>
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
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-400 transition-colors duration-300">
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
            <div className="bg-gradient-to-r from-blue-500/10 to-blue-500/10 backdrop-blur-sm rounded-3xl p-12 border border-white/10">
              <h2 className="text-4xl font-bold mb-6">
                Ready to Transform Your Classroom?
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                Join thousands of educators who are already using EduFlow to enhance their teaching experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={handleGetStarted}
                  className="px-8 py-4 bg-gradient-to-r from-blue-700 to-blue-600 rounded-full font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105"
                >
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

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto p-6">
          <div className="flex items-center justify-center min-h-full">
            {isLogin ? (
              // Login Form
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 w-full max-w-md">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white mb-8 transition-colors duration-300"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to home</span>
                </button>
                
                <h2 className="text-2xl font-bold mb-6 text-center text-white">Login</h2>
                <form onSubmit={HandleLogin} className="space-y-6">
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
    <div className="relative">
      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input 
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
        placeholder="Enter your email"
        required
      />
    </div>
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input 
        type="password"
        name="password"
        value={formData.password}
        onChange={handleInputChange}
        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
        placeholder="Enter your password"
        required
      />
    </div>
  </div>

  <button 
    type="submit"
    className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 text-white rounded-xl py-3 hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
  >
    Login
  </button>
</form>

                <div className="mt-4 text-center">
                  <button 
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                    onClick={() => setIsLogin(false)}
                  >
                    Don't have an account? Sign up
                  </button>
                </div>
              </div>
            ) : (
              // Existing Signup Form
              <div className="flex relative z-10 flex-col items-center justify-center min-h-screen px-6 py-12">
              <div className="w-full max-w-md mx-auto">
                {/* Back Button */}
                <button
                  onClick={() => setShowModal(false)}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white mb-8 transition-colors duration-300"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to home</span>
                </button>

                {/* Role Toggle */}
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-2 mb-8 border border-white/20">
                  <div className="grid grid-cols-2 gap-0 relative">
                    <div 
                      className={`absolute top-2 bottom-2 w-1/2 bg-gradient-to-r ${currentRole.gradient} rounded-xl transition-all duration-500 ease-out shadow-lg ${
                        selectedRole === 'student' ? 'left-2' : 'left-1/2 ml-1'
                      }`}
                    />
                    
                    {/* Student Button */}
                    <button
                      onClick={() => setSelectedRole('student')}
                      className={`relative z-10 flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-semibold transition-all duration-500 ${
                        selectedRole === 'student' 
                          ? 'text-white shadow-lg' 
                          : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      <User className="w-5 h-5" />
                      <span>Student</span>
                    </button>
                    
                    {/* Teacher Button */}
                    <button
                      onClick={() => setSelectedRole('teacher')}
                      className={`relative z-10 flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-semibold transition-all duration-500 ${
                        selectedRole === 'teacher' 
                          ? 'text-white shadow-lg' 
                          : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      <GraduationCap className="w-5 h-5" />
                      <span>Teacher</span>
                    </button>
                  </div>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${currentRole.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 transform transition-all duration-500 hover:scale-110`}
                  >
                    <currentRole.icon className="w-8 h-8" />
                  </div>
                  <h1 className="text-3xl font-bold mb-2 text-white transition-all duration-500">
                    Sign up as {currentRole.title}
                  </h1>
                  <p className="text-gray-400">Create your account to get started</p>
                </div>

                {/* Signup Form */}
                <div className="space-y-6">
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 transform transition-all duration-500">
                    {/* First & Last Name */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {["firstName", "lastName"].map((field, i) => (
                        <div key={field}>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            {i === 0 ? "First Name" : "Last Name"}
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              name={field}
                              value={formData[field]}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/20 transition-all duration-300"
                              placeholder={i === 0 ? "John" : "Doe"}
                              required
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Email */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/20 transition-all duration-300"
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/20 transition-all duration-300"
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/20 transition-all duration-300"
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* School Name */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                           School Name
                        </label>
                        <div className="relative">
                          <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <select
                            name="school" // Changed to match the formData property
                            value={formData.school}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:bg-white/20 transition-all duration-300"
                            required
                          >
                            <option value="" className="bg-slate-800">
                              Select school
                            </option>
                            <option value="Dayananda sagar college" className="bg-slate-800">
                             Dayananda sagar college
                            </option>
                            <option value="PES University" className="bg-slate-800">
                              PES University
                            </option>
                            <option value="RV College" className="bg-slate-800">
                              RV College
                            </option>
                            <option value="BMS College" className="bg-slate-800">
                              BMS College
                            </option>
                          </select>
                        </div>
                      </div>

                    {/* Student Fields */}
                    {selectedRole === "student" && (
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Grade Level
                        </label>
                        <div className="relative">
                          <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <select
                            name="grade"
                            value={formData.grade}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:bg-white/20 transition-all duration-300"
                            required
                          >
                            <option value="" className="bg-slate-800">
                              Select Grade
                            </option>
                            <option value="9" className="bg-slate-800">
                              Grade 9
                            </option>
                            <option value="10" className="bg-slate-800">
                              Grade 10
                            </option>
                            <option value="11" className="bg-slate-800">
                              Grade 11
                            </option>
                            <option value="12" className="bg-slate-800">
                              Grade 12
                            </option>
                          </select>
                        </div>
                      </div>
                    )}


                    {/* Submit Button */}
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      className={`group relative w-full px-8 py-4 bg-gradient-to-r ${currentRole.gradient} rounded-xl font-semibold text-lg hover:scale-105 transition-all duration-300 hover:shadow-2xl overflow-hidden`}
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        Create {currentRole.title} Account
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${currentRole.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                      />
                    </button>
                  </div>
                </div>

                {/* Login Link */}
                <div className="text-center mt-8">
                  <p className="text-gray-400">
                    Already have an account?{" "}
                    <button className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-300"
                    onClick={()=>setIsLogin(true)}>
                      Sign in
                    </button>
                  </p>
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// Wrap the component with the ModalProvider
export default function App() {
  return (
    <ModalProvider>
      <StarterPage />
    </ModalProvider>
  );
}