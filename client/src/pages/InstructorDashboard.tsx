import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import {
  Plus, Edit2, Trash2, Users, TrendingUp, Award, BookOpen, Upload, Eye,
  BarChart3, Settings, Share2, Download, Lock, Unlock, CheckCircle,
  Clock, AlertCircle, Search, Filter, MoreVertical, Play, Pause, Archive
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  students: number;
  rating: number;
  revenue: number;
  status: "published" | "draft" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

interface StudentProgress {
  id: string;
  name: string;
  email: string;
  enrolledCourses: number;
  completedLessons: number;
  totalLessons: number;
  averageScore: number;
  xpEarned: number;
  lastActive: Date;
  status: "active" | "inactive" | "completed";
}

interface CourseStats {
  totalEnrollments: number;
  totalRevenue: number;
  averageRating: number;
  completionRate: number;
  totalStudents: number;
  activeStudents: number;
}

// Mock data
const MOCK_COURSES: Course[] = [
  {
    id: "blockchain-101",
    title: "Blockchain Fundamentals",
    description: "Master distributed ledgers and cryptography",
    category: "Web3",
    level: "Beginner",
    students: 2840,
    rating: 4.9,
    revenue: 142000,
    status: "published",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-07-01")
  },
  {
    id: "python-dev",
    title: "Python for Builders",
    description: "From zero to production - scripts, APIs, automation",
    category: "Coding",
    level: "Beginner",
    students: 4520,
    rating: 4.8,
    revenue: 226000,
    status: "published",
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-07-01")
  },
  {
    id: "js-mastery",
    title: "JavaScript & React Mastery",
    description: "Modern JS/TS from fundamentals to full-stack React",
    category: "Coding",
    level: "Beginner",
    students: 5210,
    rating: 4.9,
    revenue: 260500,
    status: "published",
    createdAt: new Date("2024-03-05"),
    updatedAt: new Date("2024-07-01")
  }
];

const MOCK_STUDENTS: StudentProgress[] = [
  {
    id: "s1",
    name: "Alice Johnson",
    email: "alice@example.com",
    enrolledCourses: 3,
    completedLessons: 45,
    totalLessons: 120,
    averageScore: 87,
    xpEarned: 4500,
    lastActive: new Date(),
    status: "active"
  },
  {
    id: "s2",
    name: "Bob Smith",
    email: "bob@example.com",
    enrolledCourses: 2,
    completedLessons: 32,
    totalLessons: 80,
    averageScore: 92,
    xpEarned: 3200,
    lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: "active"
  },
  {
    id: "s3",
    name: "Carol Davis",
    email: "carol@example.com",
    enrolledCourses: 1,
    completedLessons: 12,
    totalLessons: 40,
    averageScore: 78,
    xpEarned: 1200,
    lastActive: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: "inactive"
  }
];

export default function InstructorDashboard() {
  const { isAuthenticated, user } = useAuth();
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [students, setStudents] = useState<StudentProgress[]>(MOCK_STUDENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewCourseForm, setShowNewCourseForm] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    category: "Web3",
    level: "Beginner"
  });

  const stats: CourseStats = {
    totalEnrollments: courses.reduce((sum, c) => sum + c.students, 0),
    totalRevenue: courses.reduce((sum, c) => sum + c.revenue, 0),
    averageRating: (courses.reduce((sum, c) => sum + c.rating, 0) / courses.length).toFixed(2) as any,
    completionRate: 65,
    totalStudents: students.length,
    activeStudents: students.filter(s => s.status === "active").length
  };

  const handleCreateCourse = () => {
    if (!newCourse.title || !newCourse.description) {
      toast.error("Please fill in all fields");
      return;
    }

    const course: Course = {
      id: `course-${Date.now()}`,
      ...newCourse,
      students: 0,
      rating: 0,
      revenue: 0,
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setCourses([...courses, course]);
    setNewCourse({ title: "", description: "", category: "Web3", level: "Beginner" });
    setShowNewCourseForm(false);
    toast.success("Course created successfully!");
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter(c => c.id !== id));
    toast.success("Course deleted");
  };

  const handlePublishCourse = (id: string) => {
    setCourses(courses.map(c =>
      c.id === id ? { ...c, status: "published" as const } : c
    ));
    toast.success("Course published!");
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Instructor Dashboard</h1>
          <p className="text-slate-400">Manage your courses, track student progress, and grow your revenue</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-slate-900/50 border border-white/10">
            <CardContent className="p-4">
              <p className="text-slate-400 text-xs mb-1">Total Enrollments</p>
              <p className="text-2xl font-bold text-white">{stats.totalEnrollments.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border border-white/10">
            <CardContent className="p-4">
              <p className="text-slate-400 text-xs mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-green-400">${(stats.totalRevenue / 1000).toFixed(0)}K</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border border-white/10">
            <CardContent className="p-4">
              <p className="text-slate-400 text-xs mb-1">Avg Rating</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.averageRating}/5.0</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border border-white/10">
            <CardContent className="p-4">
              <p className="text-slate-400 text-xs mb-1">Completion Rate</p>
              <p className="text-2xl font-bold text-blue-400">{stats.completionRate}%</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border border-white/10">
            <CardContent className="p-4">
              <p className="text-slate-400 text-xs mb-1">Total Students</p>
              <p className="text-2xl font-bold text-purple-400">{stats.totalStudents}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border border-white/10">
            <CardContent className="p-4">
              <p className="text-slate-400 text-xs mb-1">Active Now</p>
              <p className="text-2xl font-bold text-emerald-400">{stats.activeStudents}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="bg-slate-800/50 border-b border-slate-700">
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="students">Student Progress</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Courses Tab */}
          <TabsContent value="courses" className="mt-8 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">My Courses ({courses.length})</h2>
              <Button
                className="bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-500/30"
                onClick={() => setShowNewCourseForm(!showNewCourseForm)}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Course
              </Button>
            </div>

            {/* New Course Form */}
            {showNewCourseForm && (
              <Card className="bg-slate-900/50 border border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Create New Course</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-slate-300 block mb-2">Course Title</label>
                    <Input
                      placeholder="e.g., Advanced Solidity Programming"
                      value={newCourse.title}
                      onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-300 block mb-2">Description</label>
                    <Textarea
                      placeholder="Describe your course..."
                      value={newCourse.description}
                      onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-slate-300 block mb-2">Category</label>
                      <select
                        value={newCourse.category}
                        onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                        className="w-full bg-slate-800/50 border border-slate-700 text-white rounded p-2"
                      >
                        <option>Web3</option>
                        <option>Coding</option>
                        <option>AI</option>
                        <option>Finance</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-slate-300 block mb-2">Level</label>
                      <select
                        value={newCourse.level}
                        onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value })}
                        className="w-full bg-slate-800/50 border border-slate-700 text-white rounded p-2"
                      >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300"
                      onClick={handleCreateCourse}
                    >
                      Create Course
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-slate-600"
                      onClick={() => setShowNewCourseForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Courses List */}
            <div className="grid gap-4">
              {courses.map(course => (
                <Card key={course.id} className="bg-slate-900/50 border border-white/10 hover:border-cyan-500/50 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{course.title}</h3>
                          <Badge
                            className={`text-xs px-2 py-1 ${
                              course.status === "published"
                                ? "bg-green-500/20 text-green-300 border-green-500/30"
                                : course.status === "draft"
                                ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                                : "bg-slate-500/20 text-slate-300 border-slate-500/30"
                            }`}
                          >
                            {course.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-slate-400 text-sm mb-3">{course.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span className="text-slate-400 flex items-center gap-1">
                            <Users className="w-4 h-4" />{course.students} students
                          </span>
                          <span className="text-yellow-400 flex items-center gap-1">
                            ⭐ {course.rating}/5
                          </span>
                          <span className="text-green-400 flex items-center gap-1">
                            💰 ${course.revenue.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        {course.status === "draft" && (
                          <Button
                            size="sm"
                            className="bg-green-600/20 hover:bg-green-600/30 text-green-300"
                            onClick={() => handlePublishCourse(course.id)}
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-600 text-red-400"
                          onClick={() => handleDeleteCourse(course.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="mt-8 space-y-6">
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800/50 border-slate-700 text-white"
                />
              </div>
              <Button variant="outline" className="border-slate-600">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="space-y-3">
              {filteredStudents.map(student => (
                <Card key={student.id} className="bg-slate-900/50 border border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{student.name}</h3>
                        <p className="text-sm text-slate-400">{student.email}</p>
                        <div className="flex gap-4 mt-2 text-xs text-slate-400">
                          <span>{student.enrolledCourses} courses</span>
                          <span>{student.completedLessons}/{student.totalLessons} lessons</span>
                          <span>Avg Score: {student.averageScore}%</span>
                          <span className="text-yellow-400">{student.xpEarned} XP</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          className={`text-xs px-2 py-1 mb-2 ${
                            student.status === "active"
                              ? "bg-green-500/20 text-green-300"
                              : "bg-slate-500/20 text-slate-300"
                          }`}
                        >
                          {student.status}
                        </Badge>
                        <div className="text-xs text-slate-400">
                          Last active: {student.lastActive.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-slate-900/50 border border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Enrollment Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-400">+23%</p>
                  <p className="text-sm text-slate-400">Compared to last month</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/50 border border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-400" />
                    Completion Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-yellow-400">65%</p>
                  <p className="text-sm text-slate-400">Students completing courses</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-8 space-y-6">
            <Card className="bg-slate-900/50 border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Instructor Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-slate-300 block mb-2">Instructor Name</label>
                  <Input
                    defaultValue={user?.name || ""}
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 block mb-2">Bio</label>
                  <Textarea
                    placeholder="Tell students about yourself..."
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 block mb-2">Payment Method</label>
                  <select className="w-full bg-slate-800/50 border border-slate-700 text-white rounded p-2">
                    <option>Bank Transfer</option>
                    <option>PayPal</option>
                    <option>Crypto Wallet</option>
                  </select>
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
