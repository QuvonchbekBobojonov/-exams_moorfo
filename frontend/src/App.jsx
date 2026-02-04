import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import CourseList from './pages/CourseList';
import CourseDetail from './pages/CourseDetail';
import ExamPlayer from './pages/ExamPlayer';
import Leaderboard from './pages/Leaderboard';
import Login from './pages/Login';
import Register from './pages/Register';
import LessonView from './pages/LessonView';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Certificate from './pages/Certificate';
import PublicProfile from './pages/PublicProfile';

function App() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <AuthProvider>
      <Router>
        <div className="flex min-h-screen bg-slate-950 text-slate-50 relative overflow-x-hidden">
          <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          <div className="flex-1 flex flex-col min-w-0">
            <Navbar toggleSidebar={toggleSidebar} />
            <main className="p-4 md:p-6 lg:p-10">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/courses" element={
                  <ProtectedRoute>
                    <CourseList />
                  </ProtectedRoute>
                } />
                <Route path="/courses/:slug" element={
                  <ProtectedRoute>
                    <CourseDetail />
                  </ProtectedRoute>
                } />
                <Route path="/lessons/:id" element={
                  <ProtectedRoute>
                    <LessonView />
                  </ProtectedRoute>
                } />
                <Route path="/exam/:id" element={
                  <ProtectedRoute>
                    <ExamPlayer />
                  </ProtectedRoute>
                } />
                <Route path="/leaderboard" element={
                  <ProtectedRoute>
                    <Leaderboard />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />
                <Route path="/certificate/:id" element={<ProtectedRoute><Certificate /></ProtectedRoute>} />
                <Route path="/users/:id" element={<ProtectedRoute><PublicProfile /></ProtectedRoute>} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
