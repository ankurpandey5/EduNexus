import React from "react";
import { Search, Filter, PlayCircle } from "lucide-react";

const courseData = [
  { id: 1, title: "React Fundamentals", teacher: "Sarah Drasner", level: "Beginner", image: "⚛️" },
  { id: 2, title: "Intro to Python", teacher: "Guido Rossum", level: "Beginner", image: "🐍" },
  { id: 3, title: "Machine Learning 101", teacher: "Andrew Ng", level: "Intermediate", image: "🤖" },
  { id: 4, title: "Data Structures", teacher: "Gayle McDowell", level: "Advanced", image: "📊" },
];

function Courses() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Explore Courses</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {courseData.map((course) => (
          <div key={course.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition cursor-pointer group">
            <div className="h-40 bg-blue-50 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform">
              {course.image}
            </div>
            <div className="p-5">
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full uppercase tracking-wider">{course.level}</span>
              <h3 className="font-bold text-gray-900 mt-3">{course.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{course.teacher}</p>
              <button className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-bold flex items-center justify-center hover:bg-blue-700 transition">
                <PlayCircle className="w-4 h-4 mr-2" /> Start Learning
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Courses;