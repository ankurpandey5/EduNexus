import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, BookOpen, CheckSquare, Calendar, BarChart3, 
  LogOut, Users, Clock, Star, Search, CheckCircle, ArrowRight,
  Sparkles, Plus, TrendingUp, Book, Award, X 
} from "lucide-react";

function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  
  // --- NEW STATES FOR SEARCH AND MODAL ---
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSession, setNewSession] = useState({ title: "", time: "", dur: "1h" });

  // Mock Data for Browse Courses
  const browseCourses = [
    { id: 1, title: "Introduction to Machine Learning", teacher: "Dr. Smith", tag: "AI & ML", students: 234, hours: "12h", rating: 4.8, icon: "🤖" },
    { id: 2, title: "Web Development with React", teacher: "Prof. Johnson", tag: "Web Dev", students: 312, hours: "18h", rating: 4.6, icon: "⚛️" },
    { id: 3, title: "Data Structures & Algorithms", teacher: "Dr. Lee", tag: "Programming", students: 189, hours: "20h", rating: 4.9, icon: "🧩" },
    { id: 4, title: "Python for Data Science", teacher: "Prof. Garcia", tag: "Data Science", students: 276, hours: "15h", rating: 4.7, icon: "🐍" },
    { id: 5, title: "UI/UX Design Fundamentals", teacher: "Ms. Chen", tag: "Design", students: 145, hours: "10h", rating: 4.5, icon: "🎨" },
    { id: 6, title: "Neural Networks Deep Dive", teacher: "Dr. Smith", tag: "AI & ML", students: 98, hours: "14h", rating: 4.8, icon: "🧠" },
    { id: 7, title: "Advanced JavaScript", teacher: "Prof. Johnson", tag: "Programming", students: 201, hours: "16h", rating: 4.4, icon: "✨" },
    { id: 8, title: "Statistics & Probability", teacher: "Dr. Patel", tag: "Mathematics", students: 167, hours: "11h", rating: 4.3, icon: "📊" },
  ];

  // --- SEARCH LOGIC ---
  const filteredCourses = browseCourses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mock Data for Quizzes
  const quizData = [
    { id: 1, title: "React Fundamentals", tag: "Web Dev", questions: 10, time: "15 min", score: "85%", completed: true },
    { id: 2, title: "Python Basics", tag: "Programming", questions: 8, time: "12 min", score: "72%", completed: true },
    { id: 3, title: "Data Structures", tag: "CS", questions: 12, time: "20 min", completed: false },
    { id: 4, title: "Neural Networks Intro", tag: "AI & ML", questions: 10, time: "18 min", completed: false },
    { id: 5, title: "Statistics 101", tag: "Mathematics", questions: 15, time: "25 min", completed: false },
  ];

  // --- PLANNER DATA MOVED TO STATE ---
  const [plannerData, setPlannerData] = useState([
    { day: "Monday", sessions: [{ title: "Machine Learning", time: "09:00", dur: "2h", color: "bg-teal-50 border-teal-100 text-teal-700" }, { title: "Data Structures", time: "14:00", dur: "1.5h", color: "bg-orange-50 border-orange-100 text-orange-700" }] },
    { day: "Tuesday", sessions: [{ title: "React Development", time: "10:00", dur: "2h", color: "bg-blue-50 border-blue-100 text-blue-700" }] },
    { day: "Wednesday", sessions: [{ title: "Statistics", time: "16:00", dur: "1h", color: "bg-green-50 border-green-100 text-green-700" }] },
    { day: "Thursday", sessions: [{ title: "Python Practice", time: "11:00", dur: "1.5h", color: "bg-purple-50 border-purple-100 text-purple-700" }] },
    { day: "Friday", sessions: [{ title: "Neural Networks", time: "09:00", dur: "2h", color: "bg-yellow-50 border-yellow-100 text-yellow-700" }] },
    { day: "Saturday", sessions: [] },
    { day: "Sunday", sessions: [] },
  ]);

  // --- ADD SESSION LOGIC ---
  const handleAddSession = (e) => {
    e.preventDefault();
    const updatedPlanner = [...plannerData];
    updatedPlanner[0].sessions.push({
      ...newSession,
      color: "bg-pink-50 border-pink-100 text-pink-700"
    });
    setPlannerData(updatedPlanner);
    setIsModalOpen(false);
    setNewSession({ title: "", time: "", dur: "1h" });
  };

  // Mock Data for Progress
  const courseProgress = [
    { name: "Machine Learning", grade: "A-", percent: 72 },
    { name: "Web Development", grade: "A+", percent: 95 },
    { name: "Data Structures", grade: "B+", percent: 58 },
    { name: "Python for DS", grade: "B", percent: 40 },
    { name: "UI/UX Design", grade: "A", percent: 85 },
  ];

  const weeklyHours = [
    { day: "Mon", hrs: "3.5h", h: "h-14" },
    { day: "Tue", hrs: "2h", h: "h-8" },
    { day: "Wed", hrs: "4h", h: "h-16" },
    { day: "Thu", hrs: "1.5h", h: "h-6" },
    { day: "Fri", hrs: "3h", h: "h-12" },
    { day: "Sat", hrs: "5h", h: "h-20" },
    { day: "Sun", hrs: "2h", h: "h-8" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-left relative">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F172A] text-white flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-gray-800">
          <Link to="/" className="flex items-center text-xl font-bold text-white">
            <span className="mr-2">🎓</span> EduVexa
          </Link>
          <p className="text-[10px] text-gray-400 mt-4 uppercase tracking-widest font-bold">Student Panel</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <SidebarButton active={activeTab === "Dashboard"} onClick={() => setActiveTab("Dashboard")} icon={<LayoutDashboard size={20}/>} label="Dashboard" />
          <SidebarButton active={activeTab === "Courses"} onClick={() => setActiveTab("Courses")} icon={<BookOpen size={20}/>} label="Courses" />
          <SidebarButton active={activeTab === "Quizzes"} onClick={() => setActiveTab("Quizzes")} icon={<CheckSquare size={20}/>} label="Quizzes" />
          <SidebarButton active={activeTab === "Planner"} onClick={() => setActiveTab("Planner")} icon={<Calendar size={20}/>} label="Planner" />
          <SidebarButton active={activeTab === "Progress"} onClick={() => setActiveTab("Progress")} icon={<BarChart3 size={20}/>} label="Progress" />
        </nav>

        <div className="p-6 border-t border-gray-800">
          <Link to="/login" className="flex items-center text-gray-400 hover:text-white transition px-4"><LogOut className="mr-3 w-5 h-5" /> Sign Out</Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-10">
        <div className="max-w-7xl mx-auto">
          
          {/* 1. DASHBOARD VIEW */}
          {activeTab === "Dashboard" && (
            <>
              <header className="mb-10 text-left">
                <h1 className="text-3xl font-bold text-gray-900">Welcome back, Student!</h1>
                <p className="text-gray-500 mt-1">Here's your learning overview.</p>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10 text-left">
                <StatCard label="Courses Enrolled" value="5" icon="📖" color="bg-teal-50" />
                <StatCard label="Quizzes Taken" value="23" icon="📋" color="bg-orange-50" />
                <StatCard label="Avg Score" value="78%" icon="📈" color="bg-green-50" />
                <StatCard label="Study Hours" value="42h" icon="📅" color="bg-blue-50" />
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm text-left">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Recent Activity</h3>
                <ul className="space-y-4">
                  <ActivityItem text="Completed Quiz: React Fundamentals" color="bg-teal-500" />
                  <ActivityItem text="Watched: Intro to Machine Learning" color="bg-orange-500" />
                  <ActivityItem text="Started Course: Data Structures" color="bg-blue-500" />
                </ul>
              </div>
            </>
          )}

          {/* 2. COURSES VIEW - Functional Search */}
          {activeTab === "Courses" && (
            <>
              <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Browse Courses</h1>
                <p className="text-gray-500 mt-1">Find and enroll in courses that match your interests.</p>
              </header>

              <div className="relative mb-10 max-w-2xl">
                <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by course name, teacher, or category..." 
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 bg-white shadow-sm transition" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredCourses.map((c) => (
                  <div key={c.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition group cursor-pointer text-left">
                    <div className="h-40 bg-[#F1F5F9] flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-300">{c.icon}</div>
                    <div className="p-5">
                      <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-lg uppercase tracking-wider">{c.tag}</span>
                      <h3 className="font-bold text-gray-900 mt-3 text-base leading-tight group-hover:text-teal-600 transition-colors">{c.title}</h3>
                      <p className="text-sm text-gray-400 mt-1 mb-4">{c.teacher}</p>
                      <div className="flex items-center justify-between text-gray-400 text-xs pt-4 border-t border-gray-50">
                        <span className="flex items-center"><Users className="w-3.5 h-3.5 mr-1"/> {c.students}</span>
                        <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1"/> {c.hours}</span>
                        <span className="flex items-center text-orange-400 font-bold"><Star className="w-3.5 h-3.5 mr-1 fill-orange-400"/> {c.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* 3. QUIZZES VIEW */}
          {activeTab === "Quizzes" && (
            <>
              <header className="mb-10 text-left">
                <h1 className="text-3xl font-bold text-gray-900">My Quizzes</h1>
                <p className="text-gray-500 mt-1">Test your knowledge with interactive quizzes.</p>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                {quizData.map((quiz) => (
                  <div key={quiz.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-lg uppercase tracking-wider">{quiz.tag}</span>
                      {quiz.completed && <span className="text-sm font-bold text-green-600">{quiz.score}</span>}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">{quiz.title}</h3>
                    <div className="flex items-center space-x-4 text-xs text-gray-400 mb-6">
                      <span className="flex items-center"><CheckSquare className="w-3.5 h-3.5 mr-1" /> {quiz.questions} questions</span>
                      <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> {quiz.time}</span>
                    </div>
                    {quiz.completed ? (
                      <div className="flex items-center text-green-600 font-semibold text-sm">
                        <CheckCircle className="w-4 h-4 mr-2" /> Completed
                      </div>
                    ) : (
                      <button className="flex items-center px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition">
                        Start Quiz <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* 4. PLANNER VIEW - Functional Modal Trigger */}
          {activeTab === "Planner" && (
            <>
              <header className="mb-10 flex justify-between items-end text-left">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Study Planner</h1>
                  <p className="text-gray-500 mt-1">Organize your study schedule effectively.</p>
                </div>
                <div className="flex space-x-3">
                  <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 shadow-sm">
                    <Sparkles className="w-4 h-4 mr-2 text-teal-500" /> AI Suggest
                  </button>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-bold hover:bg-teal-700 shadow-md transition"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Session
                  </button>
                </div>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                {plannerData.map((day, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm min-h-[220px]">
                    <div className="flex items-center text-teal-600 font-bold text-sm mb-4">
                      <Calendar className="w-4 h-4 mr-2" /> {day.day}
                    </div>
                    {day.sessions.length > 0 ? (
                      <div className="space-y-3">
                        {day.sessions.map((s, i) => (
                          <div key={i} className={`p-3 rounded-xl border ${s.color}`}>
                            <h4 className="font-bold text-sm mb-1">{s.title}</h4>
                            <div className="flex items-center text-[10px] opacity-80 font-semibold">
                              <Clock className="w-3 h-3 mr-1" /> {s.time} • <CheckSquare className="w-3 h-3 mx-1" /> {s.dur}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-32 flex items-center justify-center text-gray-300 text-xs italic">No sessions</div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* 5. PROGRESS VIEW */}
          {activeTab === "Progress" && (
            <>
              <header className="mb-10 text-left">
                <h1 className="text-3xl font-bold text-gray-900">My Progress</h1>
                <p className="text-gray-500 mt-1">Track your learning journey and achievements.</p>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <ProgressStatCard label="Overall GPA" value="3.6" icon={<TrendingUp size={18}/>} color="text-teal-500 bg-teal-50" />
                <ProgressStatCard label="Courses Active" value="5" icon={<Book size={18}/>} color="text-orange-500 bg-orange-50" />
                <ProgressStatCard label="Quizzes Passed" value="18/23" icon={<CheckSquare size={18}/>} color="text-green-500 bg-green-50" />
                <ProgressStatCard label="Achievements" value="3/6" icon={<Award size={18}/>} color="text-yellow-500 bg-yellow-50" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10 text-left">
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-800 mb-8">Course Progress</h3>
                  <div className="space-y-7">
                    {courseProgress.map((p, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-2 font-medium">
                          <span className="text-gray-900">{p.name}</span>
                          <span className="text-gray-400">{p.grade} • {p.percent}%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-teal-500 h-full rounded-full transition-all duration-500" style={{ width: `${p.percent}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                  <h3 className="text-lg font-bold text-gray-800 mb-10">Weekly Study Hours</h3>
                  <div className="flex-1 flex items-end justify-between px-2">
                    {weeklyHours.map((w, i) => (
                      <div key={i} className="flex flex-col items-center group w-full">
                        <span className="text-[10px] font-bold text-gray-900 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">{w.hrs}</span>
                        <div className={`w-10 ${w.h} bg-gray-100 rounded-t-lg group-hover:bg-teal-500 transition-colors duration-300`}></div>
                        <span className="text-xs text-gray-400 mt-4 font-medium">{w.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-left">
                <h3 className="text-lg font-bold text-gray-800 mb-8">Achievements</h3>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  <AchievementBox label="First Quiz Passed" icon="🏆" active={true} />
                  <AchievementBox label="5-Day Streak" icon="🔥" active={true} />
                  <AchievementBox label="Course Completed" icon="🎓" active={true} />
                  <AchievementBox label="Perfect Score" icon="💯" active={false} />
                  <AchievementBox label="10 Quizzes Done" icon="📝" active={false} />
                  <AchievementBox label="100 Study Hours" icon="⏰" active={false} />
                </div>
              </div>
            </>
          )}

        </div>
      </main>

      {/* --- ADD SESSION MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden text-left">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center text-left">
              <h3 className="text-xl font-bold text-gray-900">New Study Session</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>
            <form onSubmit={handleAddSession} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject / Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Java Programming"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-teal-500"
                  value={newSession.title}
                  onChange={(e) => setNewSession({...newSession, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Start Time</label>
                  <input 
                    type="time" 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-teal-500"
                    value={newSession.time}
                    onChange={(e) => setNewSession({...newSession, time: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Duration</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                    value={newSession.dur}
                    onChange={(e) => setNewSession({...newSession, dur: e.target.value})}
                  >
                    <option value="1h">1 Hour</option>
                    <option value="1.5h">1.5 Hours</option>
                    <option value="2h">2 Hours</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-teal-600 text-white font-bold py-3.5 rounded-xl hover:bg-teal-700 shadow-lg transition mt-4">
                Create Session
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// Sub-components - No changes here
const SidebarButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`w-full flex items-center px-4 py-3 rounded-lg transition font-semibold ${active ? "bg-teal-500/10 text-teal-400 border-l-4 border-teal-500 rounded-r-lg" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}>
    <span className="mr-3">{icon}</span> {label}
  </button>
);

const ProgressStatCard = ({ label, value, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between text-left">
    <div>
      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{label}</p>
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
    </div>
    <div className={`w-9 h-9 ${color} rounded-lg flex items-center justify-center`}>{icon}</div>
  </div>
);

const AchievementBox = ({ label, icon, active }) => (
  <div className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all ${active ? 'border-teal-100 bg-white shadow-sm' : 'border-gray-50 bg-gray-50/30 opacity-40'}`}>
    <div className="text-3xl mb-3">{icon}</div>
    <span className="text-[10px] font-bold text-center text-gray-600 leading-tight uppercase px-1">{label}</span>
  </div>
);

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
    <div className="text-left">
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
    </div>
    <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center text-xl`}>{icon}</div>
  </div>
);

const ActivityItem = ({ text, color }) => (
  <li className="flex items-center text-gray-600 text-left">
    <span className={`w-2 h-2 ${color} rounded-full mr-3`}></span>
    {text}
  </li>
);

export default StudentDashboard;