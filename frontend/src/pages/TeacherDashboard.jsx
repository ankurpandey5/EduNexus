import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, Video, CheckSquare, BarChart3, 
  LogOut, Plus, Users, TrendingUp, X, Upload, Trash2, 
  Save, Globe, BookOpen, Search, PlayCircle, Clock
} from "lucide-react";

function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  
  // States for course creation
  const [lessons, setLessons] = useState([]);
  const [lessonTitle, setLessonTitle] = useState("");
  const [videoSearch, setVideoSearch] = useState("");

  const stats = [
    { label: "Courses Created", value: "8", icon: <BookOpen size={20}/>, color: "bg-teal-50 text-teal-600" },
    { label: "Total Students", value: "156", icon: <Users size={20}/>, color: "bg-orange-50 text-orange-600" },
    { label: "Videos Uploaded", value: "34", icon: <Video size={20}/>, color: "bg-blue-50 text-blue-600" },
    { label: "Avg Quiz Score", value: "72%", icon: <TrendingUp size={20}/>, color: "bg-green-50 text-green-600" },
  ];

  const videoLibrary = [
    { id: 1, title: "Neural Networks Explained", course: "AI & ML", views: "1.2k", duration: "15:20" },
    { id: 2, title: "React Hooks Masterclass", course: "Web Dev", views: "850", duration: "24:45" },
    { id: 3, title: "Data Structures - Trees", course: "Programming", views: "2.1k", duration: "18:10" },
    { id: 4, title: "Python for Beginners", course: "Data Science", views: "3.4k", duration: "12:30" },
  ];

  const recentUploads = [
    { id: 1, text: "New quiz: Advanced Algorithms", color: "bg-orange-400" },
    { id: 2, text: "Video: Neural Networks Explained", color: "bg-blue-400" },
    { id: 3, text: "Course update: Web Development 101", color: "bg-teal-400" },
  ];

  const addLesson = () => {
    if (!lessonTitle) return;
    setLessons([...lessons, { id: Date.now(), title: lessonTitle, type: "Video" }]);
    setLessonTitle("");
  };

  const filteredVideos = videoLibrary.filter(v => 
    v.title.toLowerCase().includes(videoSearch.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-left relative">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F172A] text-white flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-gray-800">
          <Link to="/" className="flex items-center text-xl font-bold text-white">
            <span className="mr-2">🎓</span> EduVexa
          </Link>
          <p className="text-[10px] text-gray-400 mt-4 uppercase tracking-widest font-bold">Teacher Panel</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <SidebarButton active={activeTab === "Dashboard"} onClick={() => setActiveTab("Dashboard")} icon={<LayoutDashboard size={20}/>} label="Dashboard" />
          <SidebarButton active={activeTab === "CreateCourse"} onClick={() => setActiveTab("CreateCourse")} icon={<Plus size={20}/>} label="Create Course" />
          <SidebarButton active={activeTab === "Videos"} onClick={() => setActiveTab("Videos")} icon={<Video size={20}/>} label="Video Library" />
          <SidebarButton active={activeTab === "Quizzes"} onClick={() => setActiveTab("Quizzes")} icon={<CheckSquare size={20}/>} label="Quizzes" />
          <SidebarButton active={activeTab === "Analytics"} onClick={() => setActiveTab("Analytics")} icon={<BarChart3 size={20}/>} label="Analytics" />
        </nav>

        <div className="p-6 border-t border-gray-800">
          <Link to="/login" className="flex items-center text-gray-400 hover:text-white transition px-4 py-3">
            <LogOut className="mr-3 w-5 h-5" /> Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-10">
        <div className="max-w-7xl mx-auto">
          
          {/* 1. DASHBOARD VIEW */}
          {activeTab === "Dashboard" && (
            <>
              <header className="mb-10 flex justify-between items-end">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
                  <p className="text-gray-500 mt-1">Overview of your teaching performance.</p>
                </div>
                <button onClick={() => setActiveTab("CreateCourse")} className="flex items-center px-6 py-3 bg-[#1b9a96] text-white rounded-xl font-bold hover:bg-teal-700 shadow-md transition">
                  <Plus className="mr-2" size={20} /> Create Course
                </button>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10 text-left">
                {stats.map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    </div>
                    <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>{stat.icon}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm text-left">
                <h3 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-50 pb-4">Recent Uploads</h3>
                <ul className="space-y-5">
                  {recentUploads.map((item) => (
                    <li key={item.id} className="flex items-center text-gray-600 font-medium">
                      <span className={`w-2.5 h-2.5 ${item.color} rounded-full mr-4 shrink-0`}></span>
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {/* 2. CREATE COURSE VIEW */}
          {activeTab === "CreateCourse" && (
            <div className="max-w-4xl text-left animate-in fade-in duration-300">
              <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
                <p className="text-gray-500 mt-1">Fill in the details to launch your course.</p>
              </header>

              <div className="space-y-6">
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                    <select className="w-full px-4 py-3 rounded-xl border bg-white focus:ring-2 focus:ring-teal-500 outline-none text-gray-600">
                      <option>Select a category</option>
                      <option>Web Development</option>
                      <option>Data Science</option>
                      <option>AI & Machine Learning</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Thumbnail</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 transition cursor-pointer">
                      <Upload size={40} className="mb-4 text-gray-300" />
                      <p className="font-bold text-gray-600">Click to upload or drag & drop</p>
                      <p className="text-xs mt-1 text-gray-400 font-medium">PNG, JPG up to 5MB</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 text-left">Lessons</h3>
                  <div className="flex gap-4 mb-6">
                    <input type="text" placeholder="Lesson title" className="flex-1 px-4 py-3 rounded-xl border focus:ring-2 focus:ring-teal-500 outline-none" value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)}/>
                    <button onClick={addLesson} className="p-3.5 bg-teal-50 text-teal-600 rounded-xl hover:bg-teal-600 hover:text-white transition"><Plus size={20}/></button>
                  </div>
                  {lessons.length === 0 ? <div className="py-10 text-center text-gray-400 italic font-medium">No lessons added yet.</div> : (
                    <div className="space-y-3">{lessons.map(l => (
                      <div key={l.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <span className="font-bold text-gray-700">{l.title}</span>
                        <button onClick={() => setLessons(lessons.filter(item => item.id !== l.id))} className="text-red-400 hover:text-red-600 transition"><Trash2 size={18}/></button>
                      </div>
                    ))}</div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <button className="flex-1 py-4 bg-[#1b9a96] text-white font-bold rounded-xl shadow-lg hover:bg-teal-700 transition flex items-center justify-center"><Globe size={18} className="mr-2"/> Publish Course</button>
                  <button className="px-10 py-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition flex items-center justify-center"><Save size={18} className="mr-2"/> Save as Draft</button>
                </div>
              </div>
            </div>
          )}

          {/* 3. VIDEO LIBRARY VIEW */}
          {activeTab === "Videos" && (
            <div className="text-left animate-in fade-in duration-300">
              <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Video Library</h1>
                <p className="text-gray-500 mt-1">Manage and track your lesson videos.</p>
              </header>

              <div className="relative mb-10 max-w-2xl">
                <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  value={videoSearch}
                  onChange={(e) => setVideoSearch(e.target.value)}
                  placeholder="Search by video title..." 
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-white shadow-sm" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredVideos.map((video) => (
                  <div key={video.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition group">
                    <div className="h-40 bg-gray-900 flex items-center justify-center relative">
                      <PlayCircle size={48} className="text-white opacity-50 group-hover:opacity-100 transition-opacity cursor-pointer" />
                      <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded">
                        {video.duration}
                      </span>
                    </div>
                    <div className="p-5">
                      <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">{video.course}</p>
                      <h3 className="font-bold text-gray-900 leading-tight mb-4">{video.title}</h3>
                      <div className="flex items-center justify-between text-gray-400 text-xs pt-3 border-t border-gray-50">
                        <span className="flex items-center font-medium"><Users size={14} className="mr-1"/> {video.views} views</span>
                        <button className="text-teal-600 font-bold hover:underline">Settings</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Placeholders for Quizzes and Analytics */}
          {activeTab === "Quizzes" && <div className="text-left font-bold text-2xl">Quiz Builder Content...</div>}
          {activeTab === "Analytics" && <div className="text-left font-bold text-2xl">Teacher Analytics Content...</div>}

        </div>
      </main>
    </div>
  );
}
const SidebarButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick} 
    className={`w-full flex items-center px-4 py-3 rounded-lg transition font-semibold ${
      active ? "bg-teal-500/10 text-teal-400 border-l-4 border-teal-500 rounded-r-lg" : "text-gray-400 hover:bg-gray-800 hover:text-white"
    }`}
  >
    <span className="mr-3">{icon}</span> {label}
  </button>
);
export default TeacherDashboard;
