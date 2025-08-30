"use client";
import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Calendar,
  CheckCircle,
  Upload,
  FileText,
  Clock,
  Star,
  AlertCircle,
  Download,
  Eye,
  TrendingUp,
  Award,
  Target,
  X,
  ChevronDown,
  Filter,
  Search,
  Bell,
  MessageCircle,
  BarChart3,
  Users
} from "lucide-react";

export default function StudentContent() {
  
  const [activeTab, setActiveTab] = useState("assignments");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionFile, setSubmissionFile] = useState(null);
  const [submissionText, setSubmissionText] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isMobile,setIsMobile]=useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);

    checkMobile(); // check on mount
    window.addEventListener("resize", checkMobile); // check on resize

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  
  //fetching all the assignments created by the teacher
  const [assignments, setAssignments] = useState([]);
  
  useEffect(() => {
    const token = localStorage.getItem("token"); // token survives refresh

    fetch(process.env.NEXT_PUBLIC_FETCH_ASSIGNMENT, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": "Bearer " + token }) // attach token if exists
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch assignments");
        return res.json();
      })
      .then(data => {
        // Transform the data to match the UI structure with default values
        const transformedData = data.map(assignment => ({
          ...assignment,
          dueDate: assignment.due_date,
          status: "not_submitted", // Default status
          difficulty: "Medium", // Default difficulty
          instructor: "Teacher", // Default instructor name
          points: 100, // Default points
          submittedDate: null,
          earnedPoints: null,
          feedback: null
        }));
        setAssignments(transformedData);
      })
      .catch(err => console.error(err));
  }, []); 

  // Calculate stats dynamically
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(a => a.status === "graded").length;
  const pendingAssignments = assignments.filter(a => a.status === "pending").length;
  const gradedAssignments = assignments.filter(a => a.status === "graded" && a.earnedPoints);
  const averageGrade = gradedAssignments.length > 0 
    ? Math.round(gradedAssignments.reduce((sum, a) => sum + (a.earnedPoints / a.points * 100), 0) / gradedAssignments.length)
    : 0;

  const stats = [
    {
      label: "Total Assignments",
      value: totalAssignments.toString(),
      icon: FileText,
      color: "blue",
    },
    {
      label: "Completed",
      value: completedAssignments.toString(),
      icon: CheckCircle,
      color: "green",
    },
    {
      label: "Pending",
      value: pendingAssignments.toString(),
      icon: Clock,
      color: "orange",
    },
    {
      label: "Average Grade",
      value: `${averageGrade}%`,
      icon: Star,
      color: "purple",
    },
  ];

  const colorMap = {
    blue: "from-blue-400 to-blue-500",
    green: "from-green-400 to-green-500",
    orange: "from-orange-400 to-orange-500",
    purple: "from-purple-400 to-purple-500",
  };

  const upcomingAssignments = assignments
    .filter(a => a.status === "not_submitted")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 3);

  const recentGrades = assignments
    .filter(a => a.status === "graded")
    .sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate))
    .slice(0, 3);

  const filteredAssignments = assignments.filter((a) => {
    const matchesStatus = filterStatus === "all" || a.status === filterStatus;
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         a.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "graded":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "not_submitted":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "graded":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "not_submitted":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case "Easy":
        return "bg-green-100 text-green-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "Hard":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleSubmit = (assignmentId) => {
    setSelectedAssignment(assignmentId);
    setShowSubmissionModal(true);
  };

  const handleFileSubmission = () => {
    if (selectedAssignment && (submissionFile || submissionText.trim())) {
      setAssignments(assignments.map(assignment => 
        assignment.id === selectedAssignment 
          ? { ...assignment, status: "pending", submittedDate: new Date().toISOString().split('T')[0] }
          : assignment
      ));
      setShowSubmissionModal(false);
      setSubmissionFile(null);
      setSubmissionText("");
      setSelectedAssignment(null);
      alert("Assignment submitted successfully!");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setSubmissionFile(files[0]);
    }
  };

  return (
    <div className="max-w-7xl mt-20 mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Assignments</h1>
        <p className="text-gray-600 mt-2">Track your progress and submit assignments</p>
      </div>

      {/* Stats Cards */}
     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </h3>
              </div>
              <div
                className={`w-12 h-12 bg-gradient-to-r ${colorMap[stat.color]} rounded-xl flex items-center justify-center`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Tab Navigation with Search and Filter */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col space-y-4">
                <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setActiveTab("assignments")}
                    className={`flex-1 px-4 py-2 rounded-lg transition-all duration-300 ${
                      activeTab === "assignments"
                        ? "bg-white shadow-sm text-blue-600 font-medium"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    All Assignments
                  </button>
                  <button
                    onClick={() => setActiveTab("grades")}
                    className={`flex-1 px-4 py-2 rounded-lg transition-all duration-300 ${
                      activeTab === "grades"
                        ? "bg-white shadow-sm text-blue-600 font-medium"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Grades & Feedback
                  </button>
                </div>
                
                {activeTab === "assignments" && (
                 <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
  <div className="relative flex-1 w-full">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search assignments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                      />
                    </div>
                  
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    >
                      <option value="all">All Status</option>
                      <option value="not_submitted">Not Submitted</option>
                      <option value="pending">Pending Review</option>
                      <option value="graded">Graded</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Assignments Tab */}
            {activeTab === "assignments" && (
              <div className="p-6 space-y-4">
                {filteredAssignments.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No assignments found matching your criteria.</p>
                  </div>
                ) : (
                  filteredAssignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-300 hover:border-blue-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {assignment.title}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 border ${getStatusColor(assignment.status)}`}>
                              {getStatusIcon(assignment.status)}
                              <span className="ml-1 capitalize">{assignment.status.replace("_", " ")}</span>
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(assignment.difficulty)}`}>
                              {assignment.difficulty}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-1">
                            {assignment.subject} • {assignment.instructor} • {assignment.school}
                          </p>
                          <p className="text-gray-700 text-sm mb-3">{assignment.description}</p>
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              Due: {formatDate(assignment.dueDate)}
                            </div>
                            <div className="flex items-center">
                              <Target className="w-4 h-4 mr-1" />
                              {assignment.points} points
                            </div>
                            {assignment.submittedDate && (
                              <div className="flex items-center">
                                <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                                Submitted: {formatDate(assignment.submittedDate)}
                              </div>
                            )}
                          </div>
                          {assignment.status === "graded" && (
                            <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-green-800">Final Grade</span>
                                <div className="text-right">
                                  <span className="text-2xl font-bold text-green-600">
                                    {Math.round((assignment.earnedPoints / assignment.points) * 100)}%
                                  </span>
                                  <p className="text-sm text-green-600">
                                    {assignment.earnedPoints}/{assignment.points} points
                                  </p>
                                </div>
                              </div>
                              {assignment.feedback && (
                                <div className="mt-3 p-3 bg-white rounded-lg border">
                                  <p className="text-sm font-medium text-gray-900 mb-1">Instructor Feedback:</p>
                                  <p className="text-sm text-gray-700">{assignment.feedback}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                       {!isMobile&&( <div className="flex items-center space-x-2 ml-4">
                          {assignment.status === "not_submitted" && (
                            <button 
                              onClick={() => handleSubmit(assignment.id)}
                              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 shadow-lg"
                            >
                              <Upload className="w-4 h-4" />
                              <span>Submit</span>
                            </button>
                          )}
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>)}
                      </div>
                      {isMobile&&(<div className="flex items-center space-x-2 ml-4">
                          {assignment.status === "not_submitted" && (
                            <button 
                              onClick={() => handleSubmit(assignment.id)}
                              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 shadow-lg"
                            >
                              <Upload className="w-4 h-4" />
                              <span>Submit</span>
                            </button>
                          )}
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>)}
                    </div>

                  ))
                )}
              </div>
            )}

            {/* Grades Tab */}
            {activeTab === "grades" && (
              <div className="p-6">
                <div className="space-y-4">
                  {assignments.filter(a => a.status === "graded").length === 0 ? (
                    <div className="text-center py-8">
                      <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">No graded assignments yet.</p>
                    </div>
                  ) : (
                    assignments.filter(a => a.status === "graded").map((assignment) => (
                      <div key={assignment.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-lg">{assignment.title}</h4>
                            <p className="text-sm text-gray-600">{assignment.subject} • {assignment.instructor}</p>
                            <p className="text-xs text-gray-500">
                              Submitted: {formatDate(assignment.submittedDate)}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-gray-900">
                              {Math.round((assignment.earnedPoints / assignment.points) * 100)}%
                            </div>
                            <div className="text-sm text-gray-600">
                              {assignment.earnedPoints}/{assignment.points} pts
                            </div>
                          </div>
                        </div>
                        {assignment.feedback && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-900 mb-2">Instructor Feedback:</p>
                            <p className="text-sm text-gray-700">{assignment.feedback}</p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Assignments */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-orange-500" />
              Upcoming Deadlines
            </h3>
            <div className="space-y-3">
              {upcomingAssignments.length === 0 ? (
                <p className="text-gray-500 text-sm">No upcoming deadlines</p>
              ) : (
                upcomingAssignments.map((assignment) => (
                  <div key={assignment.id} className="p-3 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
                    <h4 className="font-medium text-gray-900 text-sm">{assignment.title}</h4>
                    <p className="text-xs text-gray-600 mb-1">{assignment.subject}</p>
                    <p className="text-xs text-orange-600 font-medium">
                      Due: {formatDate(assignment.dueDate)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Grades */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-green-500" />
              Recent Grades
            </h3>
            <div className="space-y-3">
              {recentGrades.length === 0 ? (
                <p className="text-gray-500 text-sm">No grades available yet</p>
              ) : (
                recentGrades.map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{assignment.title}</h4>
                      <p className="text-xs text-gray-600">{assignment.subject}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">
                        {Math.round((assignment.earnedPoints / assignment.points) * 100)}%
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl hover:from-blue-200 hover:to-purple-200 transition-all duration-300">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700">View Progress</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl hover:from-green-200 hover:to-blue-200 transition-all duration-300">
                <Calendar className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">View Calendar</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl hover:from-purple-200 hover:to-pink-200 transition-all duration-300">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <span className="text-gray-700">Study Materials</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Submission Modal */}
      {showSubmissionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Submit Assignment</h2>
                  <p className="text-gray-600 mt-1">
                    {assignments.find(a => a.id === selectedAssignment)?.title}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowSubmissionModal(false);
                    setSubmissionFile(null);
                    setSubmissionText("");
                    setSelectedAssignment(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload File
                </label>
                <div 
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                    isDragOver 
                      ? 'border-blue-400 bg-blue-50' 
                      : submissionFile 
                        ? 'border-green-400 bg-green-50' 
                        : 'border-gray-300 hover:border-blue-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className={`w-12 h-12 mx-auto mb-3 ${
                    submissionFile ? 'text-green-500' : 'text-gray-400'
                  }`} />
                  {submissionFile ? (
                    <div>
                      <p className="text-green-600 font-medium mb-2">File Selected!</p>
                      <p className="text-sm text-gray-700 mb-3">{submissionFile.name}</p>
                      <button
                        onClick={() => setSubmissionFile(null)}
                        className="text-sm text-red-600 hover:text-red-800 underline"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-600 mb-2">Drop your file here or click to browse</p>
                      <input
                        type="file"
                        onChange={(e) => setSubmissionFile(e.target.files[0])}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg"
                      >
                        Choose File
                      </label>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  placeholder="Add any additional notes or comments..."
                ></textarea>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowSubmissionModal(false);
                  setSubmissionFile(null);
                  setSubmissionText("");
                  setSelectedAssignment(null);
                }}
                className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleFileSubmission}
                disabled={!submissionFile && !submissionText.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}