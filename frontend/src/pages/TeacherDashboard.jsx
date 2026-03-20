import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, Video, CheckSquare, BarChart3, 
  LogOut, Plus, Users, TrendingUp, X, Upload, Trash2, 
  Save, Globe, BookOpen, Search, PlayCircle, Clock
} from "lucide-react";
import { dashboardAPI, courseAPI, quizAPI, videoAPI } from "../services/api";

function TeacherDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Dashboard");
  
  // States for course creation
  const [lessons, setLessons] = useState([]);
  const [lessonTitle, setLessonTitle] = useState("");
  const [videoSearch, setVideoSearch] = useState("");

  // States for course creation form
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    category: '',
    thumbnail: '',
    difficulty: 'beginner',
    status: 'draft'
  });
  // States for video library
  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    courseId: '',
    duration: '',
    videoUrl: '',
    tags: []
  });
  const [showVideoUpload, setShowVideoUpload] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  
  // Video player state
  const [playingVideo, setPlayingVideo] = useState(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  // Video settings state
  const [showVideoSettings, setShowVideoSettings] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);
  const [showVideoEdit, setShowVideoEdit] = useState(false);
  
  // Debug: Log when showVideoSettings changes
  useEffect(() => {
    console.log('showVideoSettings changed to:', showVideoSettings);
  }, [showVideoSettings]);
  const [editVideoForm, setEditVideoForm] = useState({
    title: '',
    description: '',
    courseId: '',
    duration: '',
    videoUrl: '',
    tags: []
  });
  const [isUpdatingVideo, setIsUpdatingVideo] = useState(false);

  // Debug: Log when state changes
  useEffect(() => {
    console.log('showVideoSettings changed:', showVideoSettings);
  }, [showVideoSettings]);

  // Quiz creation state
  const [quizForm, setQuizForm] = useState({
    title: '',
    course: '',
    timeLimit: 30,
    passingScore: 70,
    maxAttempts: 3,
    questions: []
  });
  const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);

  // Video upload handlers
  const handleVideoFormChange = (field, value) => {
    setVideoForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const uploadVideo = async () => {
    if (!videoForm.title || !videoForm.courseId) {
      alert('Please fill in video title and select a course');
      return;
    }

    setIsUploadingVideo(true);
    try {
      const data = await videoAPI.uploadVideo(videoForm);

      if (data.success) {
        alert('Video uploaded successfully!');
        
        // Reset form
        setVideoForm({
          title: '',
          description: '',
          courseId: '',
          duration: '',
          videoUrl: '',
          tags: []
        });
        setShowVideoUpload(false);
        
        // Reload videos
        const videosResponse = await dashboardAPI.getVideoLibrary();
        if (videosResponse.success) {
          setVideos(videosResponse.data);
        }
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      alert(`Failed to upload video: ${error.message}`);
    } finally {
      setIsUploadingVideo(false);
    }
  };

  // Video player handlers
  const playVideo = (video) => {
    setPlayingVideo(video);
    setShowVideoPlayer(true);
  };

  const closeVideoPlayer = () => {
    setShowVideoPlayer(false);
    setPlayingVideo(null);
  };

  // Convert YouTube URL to embed URL
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return url; // Return original URL if not YouTube
  };

  // Video management handlers
  const deleteVideo = async (videoId, buttonElement) => {
    console.log('deleteVideo function called with ID:', videoId);
    
    try {
      console.log('Making API call to delete video...');
      const data = await videoAPI.deleteVideo(videoId);
      console.log('Delete API response:', data);

      if (data.success) {
        alert('Video deleted successfully!');
        setShowVideoSettings(null);
        
        // Reload videos
        const videosResponse = await dashboardAPI.getVideoLibrary();
        if (videosResponse.success) {
          setVideos(videosResponse.data);
        }
      } else {
        throw new Error(data.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      alert(`Failed to delete video: ${error.message}`);
    }
  };

  // Video edit handlers
  const startEditingVideo = (video) => {
    console.log('Starting edit for video:', video);
    setEditingVideo(video);
    setEditVideoForm({
      title: video.title,
      description: video.description || '',
      courseId: video.course?._id || video.course || '',
      duration: video.duration || '',
      videoUrl: video.videoUrl || '',
      tags: video.tags || []
    });
    setShowVideoEdit(true);
    setShowVideoSettings(null);
  };

  const handleEditVideoFormChange = (field, value) => {
    setEditVideoForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateVideo = async () => {
    if (!editVideoForm.title || !editVideoForm.courseId) {
      alert('Please fill in video title and select a course');
      return;
    }

    setIsUpdatingVideo(true);
    try {
      const data = await videoAPI.updateVideo(editingVideo._id, editVideoForm);

      if (data.success) {
        alert('Video updated successfully!');
        setShowVideoEdit(false);
        setEditingVideo(null);
        
        // Reload videos
        const videosResponse = await dashboardAPI.getVideoLibrary();
        if (videosResponse.success) {
          setVideos(videosResponse.data);
        }
      } else {
        throw new Error(data.message || 'Update failed');
      }
    } catch (error) {
      console.error('Error updating video:', error);
      alert(`Failed to update video: ${error.message}`);
    } finally {
      setIsUpdatingVideo(false);
    }
  };

  const cancelVideoEdit = () => {
    setShowVideoEdit(false);
    setEditingVideo(null);
    setEditVideoForm({
      title: '',
      description: '',
      courseId: '',
      duration: '',
      videoUrl: '',
      tags: []
    });
  };

  // Quiz creation handlers
  const handleQuizFormChange = (field, value) => {
    setQuizForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      question: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 1
    };
    setQuizForm(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const updateQuestion = (questionId, field, value) => {
    setQuizForm(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, [field]: value } : q
      )
    }));
  };

  const removeQuestion = (questionId) => {
    setQuizForm(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  const createQuiz = async () => {
    if (!quizForm.title || !quizForm.course) {
      alert('Please fill in quiz title and select a course');
      return;
    }

    if (quizForm.questions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    // Validate questions
    const invalidQuestions = quizForm.questions.filter(q => !q.question || q.question.trim() === '');
    if (invalidQuestions.length > 0) {
      alert('Please fill in all question texts');
      return;
    }

    setIsCreatingQuiz(true);
    try {
      const response = await quizAPI.createQuiz(quizForm);
      
      if (response.success) {
        alert('Quiz created successfully!');
        
        // Reset form
        setQuizForm({
          title: '',
          course: '',
          timeLimit: 30,
          passingScore: 70,
          maxAttempts: 3,
          questions: []
        });
        
        // Reload quizzes
        const quizzesResponse = await quizAPI.getTeacherQuizzes();
        if (quizzesResponse.success) {
          setQuizzes(quizzesResponse.data);
        }
      }
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert(`Failed to create quiz: ${error.message || 'Please try again.'}`);
    } finally {
      setIsCreatingQuiz(false);
    }
  };

  // States for API data
  const [stats, setStats] = useState([
    { label: "Courses Created", value: "0", icon: <BookOpen size={20}/>, color: "bg-teal-50 text-teal-600" },
    { label: "Total Students", value: "0", icon: <Users size={20}/>, color: "bg-orange-50 text-orange-600" },
    { label: "Videos Uploaded", value: "0", icon: <Video size={20}/>, color: "bg-blue-50 text-blue-600" },
    { label: "Avg Quiz Score", value: "0%", icon: <TrendingUp size={20}/>, color: "bg-green-50 text-green-600" },
  ]);
  const [recentUploads, setRecentUploads] = useState([]);
  const [courses, setCourses] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [videos, setVideos] = useState([]);

  // Load dashboard data on component mount
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || user.role !== 'teacher') {
      navigate('/login');
      return;
    }
    
    loadDashboardData();
  }, [navigate]);

  // Close video settings when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showVideoSettings && !event.target.closest('.video-settings-menu') && !event.target.closest('.settings-button')) {
        setShowVideoSettings(null);
      }
    };

    if (showVideoSettings) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showVideoSettings]);

  const loadDashboardData = async () => {
    try {
      // Load teacher stats
      const statsResponse = await dashboardAPI.getTeacherStats();
      if (statsResponse.success) {
        const newStats = [
          { label: "Courses Created", value: statsResponse.data.coursesCreated.toString(), icon: <BookOpen size={20}/>, color: "bg-teal-50 text-teal-600" },
          { label: "Total Students", value: statsResponse.data.totalStudents.toString(), icon: <Users size={20}/>, color: "bg-orange-50 text-orange-600" },
          { label: "Videos Uploaded", value: statsResponse.data.videosUploaded.toString(), icon: <Video size={20}/>, color: "bg-blue-50 text-blue-600" },
          { label: "Avg Quiz Score", value: statsResponse.data.avgQuizScore, icon: <TrendingUp size={20}/>, color: "bg-green-50 text-green-600" },
        ];
        setStats(newStats);
      }

      // Load recent activity
      const activityResponse = await dashboardAPI.getRecentActivity();
      if (activityResponse.success) {
        setRecentUploads(activityResponse.data);
      }

      // Load teacher courses
      const coursesResponse = await courseAPI.getTeacherCourses();
      if (coursesResponse.success) {
        setCourses(coursesResponse.data);
      }

      // Load teacher quizzes
      const quizzesResponse = await quizAPI.getTeacherQuizzes();
      if (quizzesResponse.success) {
        setQuizzes(quizzesResponse.data);
      }

      // Load videos
      const videosResponse = await dashboardAPI.getVideoLibrary();
      if (videosResponse.success) {
        setVideos(videosResponse.data);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const addLesson = () => {
    if (!lessonTitle) return;
    setLessons([...lessons, { id: Date.now(), title: lessonTitle, type: "video" }]);
    setLessonTitle("");
  };

  const filteredVideos = videos.filter(v => 
    v.title.toLowerCase().includes(videoSearch.toLowerCase())
  );

  // Get current user info
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Course creation handlers
  const handleCourseFormChange = (field, value) => {
    setCourseForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For now, just store the file name. In production, you'd upload to a cloud service
      handleCourseFormChange('thumbnail', file.name);
    }
  };

  const createCourse = async (publish = false) => {
    if (!courseForm.title || !courseForm.description || !courseForm.category) {
      alert('Please fill in all required fields');
      return;
    }

    setIsCreatingCourse(true);
    try {
      // Prepare lessons with proper structure
      const preparedLessons = lessons.map((lesson, index) => ({
        title: lesson.title,
        type: lesson.type || 'video',
        order: index + 1,
        duration: lesson.duration || ''
      }));

      const courseData = {
        title: courseForm.title,
        description: courseForm.description,
        category: courseForm.category,
        difficulty: courseForm.difficulty,
        status: publish ? 'published' : 'draft',
        thumbnail: courseForm.thumbnail,
        lessons: preparedLessons
      };

      console.log('Sending course data:', courseData); // Debug log

      const response = await courseAPI.createCourse(courseData);
      
      console.log('Course creation response:', response); // Debug log
      
      if (response.success) {
        alert(`Course ${publish ? 'published' : 'saved as draft'} successfully!`);
        
        // Reset form
        setCourseForm({
          title: '',
          description: '',
          category: '',
          thumbnail: '',
          difficulty: 'beginner',
          status: 'draft'
        });
        setLessons([]);
        
        // Reload courses
        const coursesResponse = await courseAPI.getTeacherCourses();
        if (coursesResponse.success) {
          setCourses(coursesResponse.data);
        }
        
        // Switch to dashboard
        setActiveTab('Dashboard');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      alert(`Failed to create course: ${error.message || 'Please try again.'}`);
    } finally {
      setIsCreatingCourse(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-left relative">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F172A] text-white flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-gray-800">
          <Link to="/" className="flex items-center text-xl font-bold text-white">
            <span className="mr-2">🎓</span> EduVexa
          </Link>
          <p className="text-[10px] text-gray-400 mt-4 uppercase tracking-widest font-bold">Teacher Panel</p>
          <div className="mt-4 p-3 bg-gray-800 rounded-lg">
            <p className="text-sm text-white font-medium">{currentUser.name || 'Teacher'}</p>
            <p className="text-xs text-gray-400">{currentUser.email || 'teacher@example.com'}</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <SidebarButton active={activeTab === "Dashboard"} onClick={() => setActiveTab("Dashboard")} icon={<LayoutDashboard size={20}/>} label="Dashboard" />
          <SidebarButton active={activeTab === "CreateCourse"} onClick={() => setActiveTab("CreateCourse")} icon={<Plus size={20}/>} label="Create Course" />
          <SidebarButton active={activeTab === "Videos"} onClick={() => setActiveTab("Videos")} icon={<Video size={20}/>} label="Video Library" />
          <SidebarButton active={activeTab === "Quizzes"} onClick={() => setActiveTab("Quizzes")} icon={<CheckSquare size={20}/>} label="Quizzes" />
          <SidebarButton active={activeTab === "Analytics"} onClick={() => setActiveTab("Analytics")} icon={<BarChart3 size={20}/>} label="Analytics" />
        </nav>

        <div className="p-6 border-t border-gray-800">
          <button onClick={handleLogout} className="flex items-center text-gray-400 hover:text-white transition px-4 py-3">
            <LogOut className="mr-3 w-5 h-5" /> Sign Out
          </button>
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

              <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm text-left mt-6">
                <h3 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-50 pb-4">Your Courses</h3>
                {courses.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 italic">
                    No courses created yet. Click "Create Course" to get started!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {courses.map((course) => (
                      <div key={course._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div>
                          <h4 className="font-bold text-gray-900">{course.title}</h4>
                          <p className="text-sm text-gray-500">{course.category} • {course.lessons?.length || 0} lessons</p>
                          <p className="text-xs text-gray-400 mt-1">{course.description}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            course.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {course.status}
                          </span>
                          <button className="text-teal-600 font-bold hover:underline">Edit</button>
                          <button className="text-blue-600 font-bold hover:underline">View</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                    <label className="block text-sm font-bold text-gray-700 mb-2">Course Title *</label>
                    <input 
                      type="text" 
                      placeholder="Enter course title"
                      value={courseForm.title}
                      onChange={(e) => handleCourseFormChange('title', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Course Description *</label>
                    <textarea 
                      placeholder="Enter course description"
                      value={courseForm.description}
                      onChange={(e) => handleCourseFormChange('description', e.target.value)}
                      rows="4"
                      className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Category *</label>
                      <select 
                        value={courseForm.category}
                        onChange={(e) => handleCourseFormChange('category', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border bg-white focus:ring-2 focus:ring-teal-500 outline-none text-gray-600"
                      >
                        <option value="">Select a category</option>
                        <option value="Web Development">Web Development</option>
                        <option value="Data Science">Data Science</option>
                        <option value="AI & Machine Learning">AI & Machine Learning</option>
                        <option value="Programming">Programming</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Difficulty</label>
                      <select 
                        value={courseForm.difficulty}
                        onChange={(e) => handleCourseFormChange('difficulty', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border bg-white focus:ring-2 focus:ring-teal-500 outline-none text-gray-600"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Thumbnail</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                      id="thumbnail-upload"
                    />
                    <label 
                      htmlFor="thumbnail-upload"
                      className="border-2 border-dashed border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 transition cursor-pointer"
                    >
                      <Upload size={40} className="mb-4 text-gray-300" />
                      <p className="font-bold text-gray-600">Click to upload or drag & drop</p>
                      <p className="text-xs mt-1 text-gray-400 font-medium">PNG, JPG up to 5MB</p>
                      {courseForm.thumbnail && (
                        <p className="text-sm text-teal-600 mt-2">Selected: {courseForm.thumbnail}</p>
                      )}
                    </label>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 text-left">Lessons</h3>
                  <div className="flex gap-4 mb-6">
                    <input 
                      type="text" 
                      placeholder="Lesson title" 
                      className="flex-1 px-4 py-3 rounded-xl border focus:ring-2 focus:ring-teal-500 outline-none" 
                      value={lessonTitle} 
                      onChange={(e) => setLessonTitle(e.target.value)}
                    />
                    <button onClick={addLesson} className="p-3.5 bg-teal-50 text-teal-600 rounded-xl hover:bg-teal-600 hover:text-white transition">
                      <Plus size={20}/>
                    </button>
                  </div>
                  {lessons.length === 0 ? <div className="py-10 text-center text-gray-400 italic font-medium">No lessons added yet.</div> : (
                    <div className="space-y-3">{lessons.map(l => (
                      <div key={l.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <span className="font-bold text-gray-700">{l.title}</span>
                        <button onClick={() => setLessons(lessons.filter(item => item.id !== l.id))} className="text-red-400 hover:text-red-600 transition">
                          <Trash2 size={18}/>
                        </button>
                      </div>
                    ))}</div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => createCourse(true)}
                    disabled={isCreatingCourse}
                    className="flex-1 py-4 bg-[#1b9a96] text-white font-bold rounded-xl shadow-lg hover:bg-teal-700 transition flex items-center justify-center disabled:opacity-50"
                  >
                    <Globe size={18} className="mr-2"/> 
                    {isCreatingCourse ? 'Publishing...' : 'Publish Course'}
                  </button>
                  <button 
                    onClick={() => createCourse(false)}
                    disabled={isCreatingCourse}
                    className="px-10 py-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition flex items-center justify-center disabled:opacity-50"
                  >
                    <Save size={18} className="mr-2"/> 
                    {isCreatingCourse ? 'Saving...' : 'Save as Draft'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. VIDEO LIBRARY VIEW */}
          {activeTab === "Videos" && (
            <div className="text-left animate-in fade-in duration-300">
              <header className="mb-8 flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Video Library</h1>
                  <p className="text-gray-500 mt-1">Manage and track your lesson videos.</p>
                </div>
                <button 
                  onClick={() => setShowVideoUpload(!showVideoUpload)}
                  className="flex items-center px-6 py-3 bg-[#1b9a96] text-white rounded-xl font-bold hover:bg-teal-700 shadow-md transition"
                >
                  <Plus className="mr-2" size={20} /> Upload Video
                </button>
              </header>

              {showVideoUpload && (
                <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Upload New Video</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Video Title *</label>
                      <input 
                        type="text" 
                        placeholder="Enter video title"
                        value={videoForm.title}
                        onChange={(e) => handleVideoFormChange('title', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-teal-500 outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Course *</label>
                      <select 
                        value={videoForm.courseId}
                        onChange={(e) => handleVideoFormChange('courseId', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border bg-white focus:ring-2 focus:ring-teal-500 outline-none text-gray-600"
                      >
                        <option value="">Select a course</option>
                        {courses.map(course => (
                          <option key={course._id} value={course._id}>
                            {course.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                    <textarea 
                      placeholder="Enter video description"
                      value={videoForm.description}
                      onChange={(e) => handleVideoFormChange('description', e.target.value)}
                      rows="3"
                      className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Duration</label>
                      <input 
                        type="text" 
                        placeholder="10:30"
                        value={videoForm.duration}
                        onChange={(e) => handleVideoFormChange('duration', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-teal-500 outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Video URL</label>
                      <input 
                        type="text" 
                        placeholder="https://example.com/video.mp4"
                        value={videoForm.videoUrl}
                        onChange={(e) => handleVideoFormChange('videoUrl', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-teal-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={uploadVideo}
                      disabled={isUploadingVideo}
                      className="flex-1 py-3 bg-[#1b9a96] text-white font-bold rounded-xl shadow-lg hover:bg-teal-700 transition disabled:opacity-50"
                    >
                      {isUploadingVideo ? 'Uploading...' : 'Upload Video'}
                    </button>
                    <button 
                      onClick={() => setShowVideoUpload(false)}
                      className="px-10 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

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
                {filteredVideos.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-gray-400">
                    <Video size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No videos uploaded yet</p>
                    <p className="text-sm">Click "Upload Video" to get started</p>
                  </div>
                ) : (
                  filteredVideos.map((video) => (
                    <div key={video._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition group cursor-pointer" onClick={() => playVideo(video)}>
                      <div className="h-40 bg-gray-900 flex items-center justify-center relative">
                        <PlayCircle size={48} className="text-white opacity-50 group-hover:opacity-100 transition-opacity cursor-pointer" />
                        <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded">
                          {video.duration}
                        </span>
                      </div>
                      <div className="p-5">
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">
                          {video.course?.title || 'Uncategorized'}
                        </p>
                        <h3 className="font-bold text-gray-900 leading-tight mb-4">{video.title}</h3>
                        <div className="flex items-center justify-between text-gray-400 text-xs pt-3 border-t border-gray-50">
                          <span className="flex items-center font-medium">
                            <Users size={14} className="mr-1"/> {video.views || 0} views
                          </span>
                          <div className="flex gap-2">
                            {/* Simple Test Delete Button */}
                            <button 
                              className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded hover:bg-red-600 transition"
                              onClick={async (e) => {
                                e.stopPropagation();
                                console.log('SIMPLE DELETE CLICKED for video:', video._id);
                                
                                if (confirm(`Delete video "${video.title}"?`)) {
                                  try {
                                    console.log('Calling delete API...');
                                    const response = await fetch(`http://localhost:5000/api/videos/${video._id}`, {
                                      method: 'DELETE',
                                      headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                                      }
                                    });
                                    
                                    const data = await response.json();
                                    console.log('Delete response:', data);
                                    
                                    if (data.success) {
                                      alert('Video deleted successfully!');
                                      // Remove video from list
                                      setVideos(videos.filter(v => v._id !== video._id));
                                    } else {
                                      alert('Delete failed: ' + (data.message || 'Unknown error'));
                                    }
                                  } catch (error) {
                                    console.error('Delete error:', error);
                                    alert('Delete error: ' + error.message);
                                  }
                                }
                              }}
                            >
                              🗑️ DELETE
                            </button>
                            
                            <button 
                              className="settings-button text-white font-bold bg-blue-600 px-3 py-1 rounded-lg text-xs hover:bg-blue-700 transition"
                              onClick={(e) => {
                                console.log('SETTINGS BUTTON CLICKED! Video ID:', video._id);
                                e.stopPropagation();
                                e.preventDefault();
                                alert('Settings clicked for: ' + video.title);
                                setShowVideoSettings(showVideoSettings === video._id ? null : video._id);
                              }}
                              type="button"
                            >
                              ⚙️
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Video Settings Modal */}
                      {showVideoSettings === video._id && (
                        <div className="fixed inset-0 bg-black bg-opacity-75 z-[99999] flex items-center justify-center p-4" onClick={() => setShowVideoSettings(null)}>
                          <div className="bg-white border-4 border-red-600 rounded-xl shadow-2xl p-6 min-w-[400px] max-w-md" onClick={(e) => e.stopPropagation()}>
                            <div className="bg-red-100 p-4 rounded mb-6 border-2 border-red-300">
                              <p className="text-red-800 font-bold text-center text-xl">⚠️ VIDEO OPTIONS</p>
                              <p className="text-red-600 text-center text-sm mt-2">{video.title}</p>
                            </div>
                            
                            <button 
                              className="w-full mb-4 px-6 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition text-lg cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                console.log('EDIT CLICKED for video:', video._id);
                                startEditingVideo(video);
                              }}
                              type="button"
                            >
                              ✏️ EDIT VIDEO
                            </button>
                            
                            <button 
                              className="w-full mb-4 px-6 py-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition text-lg cursor-pointer"
                              onClick={(e) => {
                                console.log('DELETE BUTTON CLICKED!');
                                console.log('Video ID:', video._id);
                                e.stopPropagation();
                                e.preventDefault();
                                
                                if (confirm('Are you sure you want to delete this video?')) {
                                  deleteVideo(video._id, e.target);
                                }
                              }}
                              type="button"
                            >
                              🗑️ DELETE VIDEO
                            </button>
                            
                            <button 
                              className="w-full px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowVideoSettings(null);
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          {/* 4. QUIZZES VIEW */}
          {activeTab === "Quizzes" && (
            <div className="text-left animate-in fade-in duration-300">
              <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Quiz Builder</h1>
                <p className="text-gray-500 mt-1">Create and manage course quizzes.</p>
              </header>

              <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Create New Quiz</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Quiz Title *</label>
                    <input 
                      type="text" 
                      placeholder="Enter quiz title"
                      value={quizForm.title}
                      onChange={(e) => handleQuizFormChange('title', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Course *</label>
                    <select 
                      value={quizForm.course}
                      onChange={(e) => handleQuizFormChange('course', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border bg-white focus:ring-2 focus:ring-teal-500 outline-none text-gray-600"
                    >
                      <option value="">Select a course</option>
                      {courses.map(course => (
                        <option key={course._id} value={course._id}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Time Limit (minutes)</label>
                    <input 
                      type="number" 
                      placeholder="30"
                      value={quizForm.timeLimit}
                      onChange={(e) => handleQuizFormChange('timeLimit', parseInt(e.target.value) || 30)}
                      className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Passing Score (%)</label>
                    <input 
                      type="number" 
                      placeholder="70"
                      value={quizForm.passingScore}
                      onChange={(e) => handleQuizFormChange('passingScore', parseInt(e.target.value) || 70)}
                      className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Max Attempts</label>
                    <input 
                      type="number" 
                      placeholder="3"
                      value={quizForm.maxAttempts}
                      onChange={(e) => handleQuizFormChange('maxAttempts', parseInt(e.target.value) || 3)}
                      className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-bold text-gray-800 mb-4">Questions</h4>
                  
                  <div className="space-y-4 mb-6">
                    {quizForm.questions.length === 0 ? (
                      <div className="text-center py-8 text-gray-400 italic">
                        No questions added yet. Click "Add Question" to get started.
                      </div>
                    ) : (
                      quizForm.questions.map((question, index) => (
                        <div key={question.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                          <div className="flex justify-between items-start mb-3">
                            <input 
                              type="text" 
                              placeholder={`Question ${index + 1}: What is...?`}
                              value={question.question}
                              onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                              className="flex-1 px-3 py-2 rounded-lg border focus:ring-2 focus:ring-teal-500 outline-none mr-3"
                            />
                            <select 
                              value={question.type}
                              onChange={(e) => updateQuestion(question.id, 'type', e.target.value)}
                              className="px-3 py-2 rounded-lg border bg-white focus:ring-2 focus:ring-teal-500 outline-none mr-3"
                            >
                              <option value="multiple-choice">Multiple Choice</option>
                              <option value="true-false">True/False</option>
                              <option value="short-answer">Short Answer</option>
                            </select>
                            <button 
                              onClick={() => removeQuestion(question.id)}
                              className="text-red-400 hover:text-red-600 transition"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                          {question.type === 'multiple-choice' && (
                            <div className="space-y-2 ml-4">
                              {question.options.map((option, optIndex) => (
                                <input 
                                  key={optIndex}
                                  type="text" 
                                  placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                                  value={option}
                                  onChange={(e) => {
                                    const newOptions = [...question.options];
                                    newOptions[optIndex] = e.target.value;
                                    updateQuestion(question.id, 'options', newOptions);
                                  }}
                                  className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-teal-500 outline-none" 
                                />
                              ))}
                              <div className="mt-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer:</label>
                                <select 
                                  value={question.correctAnswer}
                                  onChange={(e) => updateQuestion(question.id, 'correctAnswer', parseInt(e.target.value))}
                                  className="px-3 py-2 rounded-lg border bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                                >
                                  {question.options.map((option, optIndex) => (
                                    <option key={optIndex} value={optIndex}>
                                      {String.fromCharCode(65 + optIndex)}: {option || 'Option ' + String.fromCharCode(65 + optIndex)}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  <button 
                    onClick={addQuestion}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-teal-500 hover:text-teal-600 transition font-medium"
                  >
                    + Add Question
                  </button>
                </div>

                <div className="flex gap-4 mt-6">
                  <button 
                    onClick={createQuiz}
                    disabled={isCreatingQuiz}
                    className="flex-1 py-3 bg-[#1b9a96] text-white font-bold rounded-xl shadow-lg hover:bg-teal-700 transition disabled:opacity-50"
                  >
                    {isCreatingQuiz ? 'Creating...' : 'Create Quiz'}
                  </button>
                  <button className="px-10 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition">
                    Save as Draft
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Existing Quizzes</h3>
                <div className="space-y-4">
                  {quizzes.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 italic">
                      No quizzes created yet. Create your first quiz above!
                    </div>
                  ) : (
                    quizzes.map((quiz) => (
                      <div key={quiz._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div>
                          <h4 className="font-bold text-gray-900">{quiz.title}</h4>
                          <p className="text-sm text-gray-500">
                            {quiz.course?.title || 'Uncategorized'} • {quiz.questions?.length || 0} questions
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            quiz.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {quiz.status}
                          </span>
                          <button className="text-teal-600 font-bold hover:underline">Edit</button>
                          <button className="text-red-400 hover:text-red-600 transition">
                            <Trash2 size={18}/>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
          {/* 5. ANALYTICS VIEW */}
          {activeTab === "Analytics" && (
            <div className="text-left animate-in fade-in duration-300">
              <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Teacher Analytics</h1>
                <p className="text-gray-500 mt-1">Track student progress and course performance.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-700">Total Revenue</h3>
                    <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                      <TrendingUp size={20}/>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">$12,450</p>
                  <p className="text-sm text-green-600 mt-2">+12% from last month</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-700">Completion Rate</h3>
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                      <BarChart3 size={20}/>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">78%</p>
                  <p className="text-sm text-blue-600 mt-2">+5% improvement</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-700">Active Students</h3>
                    <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center">
                      <Users size={20}/>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">234</p>
                  <p className="text-sm text-orange-600 mt-2">18 new this week</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-700">Avg. Score</h3>
                    <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                      <CheckSquare size={20}/>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">82%</p>
                  <p className="text-sm text-purple-600 mt-2">+3% increase</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Course Performance</h3>
                  <div className="space-y-4">
                    {[
                      { name: "Web Development 101", students: 89, completion: 85, avgScore: 78 },
                      { name: "Data Science Basics", students: 67, completion: 72, avgScore: 82 },
                      { name: "AI & Machine Learning", students: 45, completion: 68, avgScore: 75 }
                    ].map((course, index) => (
                      <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-bold text-gray-800">{course.name}</h4>
                          <span className="text-sm text-gray-500">{course.students} students</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">Completion</span>
                              <span className="font-bold text-gray-800">{course.completion}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-teal-500 h-2 rounded-full" 
                                style={{ width: `${course.completion}%` }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">Avg Score</span>
                              <span className="font-bold text-gray-800">{course.avgScore}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${course.avgScore}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Student Progress</h3>
                  <div className="space-y-4">
                    {[
                      { name: "Alice Johnson", email: "alice@example.com", progress: 92, lastActive: "2 hours ago" },
                      { name: "Bob Smith", email: "bob@example.com", progress: 78, lastActive: "1 day ago" },
                      { name: "Carol White", email: "carol@example.com", progress: 65, lastActive: "3 days ago" },
                      { name: "David Brown", email: "david@example.com", progress: 88, lastActive: "5 hours ago" }
                    ].map((student, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800">{student.name}</h4>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                        <div className="text-center mr-4">
                          <p className="text-sm text-gray-600">Progress</p>
                          <p className="font-bold text-gray-900">{student.progress}%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Last active</p>
                          <p className="text-sm text-gray-700">{student.lastActive}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Quiz Performance Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl font-bold text-green-700">85%</span>
                    </div>
                    <h4 className="font-bold text-gray-800">Average Score</h4>
                    <p className="text-sm text-gray-500">Across all quizzes</p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl font-bold text-blue-700">92%</span>
                    </div>
                    <h4 className="font-bold text-gray-800">Pass Rate</h4>
                    <p className="text-sm text-gray-500">Students passing quizzes</p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl font-bold text-orange-700">2.3</span>
                    </div>
                    <h4 className="font-bold text-gray-800">Avg Attempts</h4>
                    <p className="text-sm text-gray-500">Attempts per quiz</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Video Player Modal */}
      {showVideoPlayer && playingVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">{playingVideo.title}</h2>
              <button 
                onClick={closeVideoPlayer}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                {getYouTubeEmbedUrl(playingVideo.videoUrl) ? (
                  <iframe
                    src={getYouTubeEmbedUrl(playingVideo.videoUrl)}
                    title={playingVideo.title}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <video
                    src={playingVideo.videoUrl}
                    controls
                    className="w-full h-full"
                    title={playingVideo.title}
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
              
              <div className="mt-4">
                <p className="text-gray-600">{playingVideo.description}</p>
                <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Clock size={16} className="mr-1" /> {playingVideo.duration}
                  </span>
                  <span className="flex items-center">
                    <Users size={16} className="mr-1" /> {playingVideo.views || 0} views
                  </span>
                  <span className="font-bold text-blue-600">
                    {playingVideo.course?.title || 'Uncategorized'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Edit Modal */}
      {showVideoEdit && editingVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Edit Video</h2>
              <button 
                onClick={cancelVideoEdit}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Video Title *</label>
                  <input 
                    type="text" 
                    placeholder="Enter video title"
                    value={editVideoForm.title}
                    onChange={(e) => handleEditVideoFormChange('title', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Course *</label>
                  <select 
                    value={editVideoForm.courseId}
                    onChange={(e) => handleEditVideoFormChange('courseId', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border bg-white focus:ring-2 focus:ring-teal-500 outline-none text-gray-600"
                  >
                    <option value="">Select a course</option>
                    {courses.map(course => (
                      <option key={course._id} value={course._id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea 
                  placeholder="Enter video description"
                  value={editVideoForm.description}
                  onChange={(e) => handleEditVideoFormChange('description', e.target.value)}
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Duration</label>
                  <input 
                    type="text" 
                    placeholder="10:30"
                    value={editVideoForm.duration}
                    onChange={(e) => handleEditVideoFormChange('duration', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Video URL</label>
                  <input 
                    type="text" 
                    placeholder="https://example.com/video.mp4"
                    value={editVideoForm.videoUrl}
                    onChange={(e) => handleEditVideoFormChange('videoUrl', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={updateVideo}
                  disabled={isUpdatingVideo}
                  className="flex-1 py-3 bg-[#1b9a96] text-white font-bold rounded-xl shadow-lg hover:bg-teal-700 transition disabled:opacity-50"
                >
                  {isUpdatingVideo ? 'Updating...' : 'Update Video'}
                </button>
                <button 
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
                      deleteVideo(editingVideo._id);
                    }
                  }}
                  className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg hover:bg-red-700 transition"
                >
                  🗑️ Delete
                </button>
                <button 
                  onClick={cancelVideoEdit}
                  className="px-10 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
