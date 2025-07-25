"use client"
import React, { useState, useEffect } from 'react';
import { 
  Plus, BookOpen,  Users,  FileText, Clock, CheckCircle, AlertCircle, Calendar,
  Send,Upload,Eye,Edit,Trash2,Filter,Search,Bell,Settings,User,BarChart3
} from 'lucide-react';export default
 function TeacherContent() {
    const [activeTab,setactiveTab]=useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [assignments, setAssignments] = useState([
          {
      id: 1,
      title: "React Components Assignment",
      subject: "Web Development",
      dueDate: "2025-08-15",
      submissions: 12,
      totalStudents: 25,
      status: "active"
    },
      {
      id: 1,
      title: "React Components Assignment",
      subject: "Web Development",
      dueDate: "2025-08-15",
      submissions: 12,
      totalStudents: 25,
      status: "active"
    }
    ]);
    const [newAssignment,setnewAssignment]=useState({
    title: '',
    description: '',
    subject: '',
    dueDate: '',
    points: '' 
    })
    const stats=[
        {
            label:"Active Assignments",value:"12",icon:FileText,color:"blue"
        },
         {
            label:"Total students",value:"156",icon:Users,color:"green"
        },
         {
            label:"Active Assignments",value:"12",icon:Clock,color:"orange"
        },
         {
            label:"Active Assignments",value:"12",icon:CheckCircle,color:"purple"
        }
    ];
    const handleCreateAssignment=()=>{
        if(newAssignment.title&& newAssignment.subject&& newAssignment.dueDate){
            const assignment={
                id:assignments.lenght+1,
                ...newAssignment,
                submissions:0,
                totalStudents:25,
                status:"active"

            };
            setAssignments([...assignments,assignment]);
            setnewAssignment({title: '', description: '', subject: '', dueDate: '', points: ''});
            setShowCreateModal(false);
        }
    }
  return (
   <div className="max-w-7xl mt-20 mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r from-${stat.color}-400 to-${stat.color}-500 rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            <div className='lg:col-span-2'>
                <div className='bg-white rounded-2xl  shadow-sm border border-gray-100'>
                    <div className='p-6 border-b border-gray-100'>
                        <div className='flex itwms-center justify-between'>
                            <h2 className='text-xl font-semibold text-gray-900'>Assignments</h2>
                            <button
                            onclick={()=>setShowCreateModal(true)}
                            className='flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full hover:from-blue-600 hover:to-purple-600transaction-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/25 '>
                                <Plus className='w-4 h-4'/>
                                <span>create Assignment</span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
  )
}
