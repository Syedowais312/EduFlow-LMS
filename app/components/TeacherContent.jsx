"use client";
import React, { useState,useEffect } from "react";
import {
  Plus,
  BookOpen,
  Users,
  FileText,
  Clock,
  CheckCircle,
  Calendar,
  BarChart3,
  Eye,Edit,Trash2
} from "lucide-react";

export default function TeacherContent() {
  const [activeTab, setactiveTab] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);
//fetching user from localstorage to get the id and school
useEffect(() => {
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  } catch (err) {
    console.error("Invalid JSON in localStorage.user:", err);
    localStorage.removeItem("user");
  } finally {
    setLoading(false);
  }
}, []);


//fetching all the assignments created by the teacher
 const [assignments, setAssignments] = useState([]);
useEffect(() => {
  const token = localStorage.getItem("token"); 

  fetch(process.env.NEXT_PUBLIC_FETCH_ASSIGNMENT, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": "Bearer " + token })
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch assignments");
      return res.json();
    })
    .then(data => {
      setAssignments(Array.isArray(data) ? data : []);
    })
    .catch(err => {
      console.error(err);
      setAssignments([]); // fallback
    });
}, []);
  
  const [newAssignment, setnewAssignment] = useState({
    title: "",
    description: "",
    subject: "",
    dueDate: "",
    points: "",
  });

  const stats = [
    {
      label: "Active Assignments",
      value: "12",
      icon: FileText,
      color: "blue",
    },
    {
      label: "Total Students",
      value: "156",
      icon: Users,
      color: "green",
    },
    {
      label: "Due Soon",
      value: "3",
      icon: Clock,
      color: "orange",
    },
    {
      label: "Completed",
      value: "9",
      icon: CheckCircle,
      color: "purple",
    },
  ];

  const colorMap = {
    blue: "from-blue-400 to-blue-500",
    green: "from-green-400 to-green-500",
    orange: "from-orange-400 to-orange-500",
    purple: "from-purple-400 to-purple-500",
  };
const handleCreateAssignment = async () => {
   


  

  if (
    !newAssignment.title ||
    !newAssignment.subject ||
    !newAssignment.dueDate
  ) {
    alert("Please fill all required fields");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const res = await fetch(process.env.NEXT_PUBLIC_ASSIGNMENT_CREATE, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
  title: newAssignment.title,
  description: newAssignment.description,
  subject: newAssignment.subject,
  due_date: new Date(newAssignment.dueDate).toISOString(), // convert to ISO string
  teacher_id: user.id,   
  school: user.school,
}),

    });
if (!res.ok) {
  const errorText = await res.text(); // 👀 grab backend response
  console.error("Backend error:", errorText);
  throw new Error("Failed to create assignment");
}
    const data = await res.json();

    
    setAssignments((prev) => [...prev, data]);
    setnewAssignment({
      title: "",
      description: "",
      subject: "",
      dueDate: "",
      points: "",
    });
    setShowCreateModal(false);
  } catch (error) {
    console.error("Error creating assignment:", error);
    alert("Error creating assignment");
  }
};
if (loading) {
  return <div className="p-6">Loading...</div>;
}

  return (
    <div className="max-w-7xl mt-30 mx-auto px-6 py-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

      {/* Assignment List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Assignments</h2>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-700 to-blue-600 text-white px-4 py-2 rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/25"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Assignment</span>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300 hover:border-blue-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {assignment.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-1">{assignment.subject}</p>
                      <p className="text-gray-500 text-sm mb-2">{assignment.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-4 mr-1" />
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {assignment.submissions}/{assignment.totalStudents} Submitted
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${
                                (assignment.submissions / assignment.totalStudents) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl hover:from-blue-200 hover:to-purple-200 transition-all duration-300">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700">View Analytics</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl hover:from-green-200 hover:to-blue-200 transition-all duration-300">
                <Users className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Manage students</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl hover:from-purple-200 hover:to-pink-200 transition-all duration-300">
                <Calendar className="w-5 h-5 text-purple-600" />
                <span className="text-gray-700">Schedule Class</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-700">John submitted React Assignment</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-700">Sarah asked a question</p>
                  <p className="text-xs text-gray-500">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-700">Database project due tomorrow</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Create New Assignment</h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment Title
                </label>
                <input
                  type="text"
                  value={newAssignment.title}
                  onChange={(e) => setnewAssignment({ ...newAssignment, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newAssignment.description}
                  onChange={(e) =>
                    setnewAssignment({ ...newAssignment, description: e.target.value })
                  }
                  rows="4"
                  className="w-full py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  placeholder="Assignment description..."
                ></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={newAssignment.subject}
                    onChange={(e) =>
                      setnewAssignment({ ...newAssignment, subject: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    placeholder="Subject name..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={newAssignment.dueDate}
                    onChange={(e) =>
                      setnewAssignment({ ...newAssignment, dueDate: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
                <input
                  type="number"
                  value={newAssignment.points}
                  onChange={(e) =>
                    setnewAssignment({ ...newAssignment, points: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  placeholder="Total points"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAssignment}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-105"
              >
                Create Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
