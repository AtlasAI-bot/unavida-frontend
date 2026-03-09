import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StudentProgressProvider } from './context/StudentProgressContext';
import { AuthProvider } from './context/AuthContext';
import { NotesProvider } from './context/NotesContext';
import { ProgressProvider } from './context/ProgressContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RootRedirect } from './components/RootRedirect';
import { Home } from './components/Home';
import { Bookshelf } from './components/Bookshelf';
import { TextbookDashboard } from './components/TextbookDashboard';
import { ChapterReader } from './components/ChapterReader';
import { Login } from './components/Login';
import { InstructorDashboard } from './components/InstructorDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import ChapterHub from './components/ChapterHub';
import { PressPrototypeViewer } from './components/PressPrototypeViewer';
import { WorkbookPage } from './components/WorkbookPage';
import { VideoLibraryPage } from './components/VideoLibraryPage';
import { QuizzesPage } from './components/QuizzesPage';
import { FlashcardsPage } from './components/FlashcardsPage';
import { CaseStudiesPage } from './components/CaseStudiesPage';

export function App() {
  return (
    <AuthProvider>
      <StudentProgressProvider>
        <NotesProvider>
          <ProgressProvider>
            <Router>
              <Routes>
                {/* Root redirect - handles auth-based routing */}
                <Route path="/" element={<RootRedirect />} />
                
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                
                {/* New Flow - Student Landing Pages */}
                {/* Bookshelf - Landing page after login showing textbooks only */}
                <Route 
                  path="/bookshelf" 
                  element={
                    <ProtectedRoute requiredRole="student">
                      <Bookshelf />
                    </ProtectedRoute>
                  } 
                />

                {/* TextbookDashboard - Units and chapters for a specific textbook */}
                <Route 
                  path="/textbook/:textbookId" 
                  element={
                    <ProtectedRoute requiredRole="student">
                      <TextbookDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Home Route - Protected - Main textbooks/bookshelves page (legacy) */}
                <Route 
                  path="/home" 
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Protected Routes */}
                <Route 
                  path="/student-dashboard" 
                  element={
                    <ProtectedRoute requiredRole="student">
                      <ChapterHub />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/instructor-dashboard" 
                  element={
                    <ProtectedRoute requiredRole="instructor">
                      <InstructorDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin-dashboard" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Canonical Chapter 1 route alignment (Railway + Vercel) */}
                <Route path="/reader/ch1_intro_to_pharmacology" element={<Navigate to="/reader/ch1_intro" replace />} />

                {/* Chapter Reader - Protected */}
                <Route 
                  path="/reader/:chapterId" 
                  element={
                    <ProtectedRoute requiredRole="student">
                      <ChapterReader />
                    </ProtectedRoute>
                  } 
                />

                {/* Chapter Hub - Learning Materials Hub - Protected */}
                <Route 
                  path="/chapter/:chapterId/hub" 
                  element={
                    <ProtectedRoute requiredRole="student">
                      <ChapterHub />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Workbook page scaffold */}
                <Route
                  path="/workbook"
                  element={
                    <ProtectedRoute requiredRole="student">
                      <WorkbookPage />
                    </ProtectedRoute>
                  }
                />

                {/* Video library page scaffold */}
                <Route
                  path="/video-library"
                  element={
                    <ProtectedRoute requiredRole="student">
                      <VideoLibraryPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/quizzes"
                  element={
                    <ProtectedRoute requiredRole="student">
                      <QuizzesPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/flashcards"
                  element={
                    <ProtectedRoute requiredRole="student">
                      <FlashcardsPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/case-studies"
                  element={
                    <ProtectedRoute requiredRole="student">
                      <CaseStudiesPage />
                    </ProtectedRoute>
                  }
                />

                {/* UnaVida Press production prototype (safe preview route) */}
                <Route
                  path="/press/prototype"
                  element={
                    <ProtectedRoute requiredRole="student">
                      <PressPrototypeViewer />
                    </ProtectedRoute>
                  }
                />

                {/* Catch all - redirect to home page (which will handle auth-based routing) */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </ProgressProvider>
        </NotesProvider>
      </StudentProgressProvider>
    </AuthProvider>
  );
}

export default App;
