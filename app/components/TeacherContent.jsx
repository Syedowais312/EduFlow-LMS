"use client";
import React, { useState } from "react";
import {
  Plus,
  BookOpen,
  Users,
  FileText,
  Clock,
  CheckCircle,
  Calendar,
} from "lucide-react";

export default function TeacherContent() {
  const [activeTab, setactiveTab] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: "React Components Assignment",
      subject: "Web Development",
      dueDate: "2025-08-15",
      submissions: 12,
      totalStudents: 25,
      status: "active",
    },
    {
      id: 2,
      title: "JS Functions Assignment",
      subject: "Web Development",
      dueDate: "2025-08-22",
      submissions: 8,
      totalStudents: 25,
      status: "active",
    },
  ]);

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

  const handleCreateAssignment = () => {
    if (
      newAssignment.title &&
      newAssignment.subject &&
      newAssignment.dueDate
    ) {
      const assignment = {
        id: assignments.length + 1,
        ...newAssignment,
        submissions: 0,
        totalStudents: 25,
        status: "active",
      };
      setAssignments([...assignments, assignment]);
      setnewAssignment({
        title: "",
        description: "",
        subject: "",
        dueDate: "",
        points: "",
      });
      setShowCreateModal(false);
    }
  };

  return (
    <div className="max-w-7xl mt-20 mx-auto px-6 py-8">
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
                className={`w-12 h-12 bg-gradient-to-r from-${stat.color}-400 to-${stat.color}-500 rounded-xl flex items-center justify-center`}
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
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/25"
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
                      <p className="text-gray-600 text-sm mb-2">{assignment.subject}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-4 mr-1" />
                          Due:{" "}
                          {new Date(assignment.dueDate).toLocaleDateString()}
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
                                (assignment.submissions / assignment.totalStudents) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
