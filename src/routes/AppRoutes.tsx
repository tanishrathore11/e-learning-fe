import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { User } from '../types/auth';

// Pages
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import CoursesPage from '../pages/CoursesPage';
import CourseDetailsPage from '../pages/CourseDetailsPage';
import LessonDetailsPage from '../pages/LessonDetailsPage';
import ProfilePage from '../pages/ProfilePage';

// Student pages
import StudentDashboardPage from '../pages/student/StudentDashboardPage';
import StudentMyCoursesPage from '../pages/student/MyCoursesPage';

// Instructor pages
import InstructorDashboardPage from '../pages/instructor/InstructorDashboardPage';
import InstructorMyCoursesPage from '../pages/instructor/MyCoursesPage';
import CreateCoursePage from '../pages/instructor/CreateCoursePage';
import EditCoursePage from '../pages/instructor/EditCoursePage';
import ManageLessonsPage from '../pages/instructor/ManageLessonsPage';

// Admin pages
import TopicsPage from '../pages/admin/TopicsPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';

interface AppRoutesProps {
  user: User | null;
}

interface ProtectedRouteProps {
  user: User | null;
  allowedRoles?: string[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, allowedRoles, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const AppRoutes: React.FC<AppRoutesProps> = ({ user }) => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage user={user} />} />
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/" replace /> : <RegisterPage />}
      />

      {/* Authenticated - any role */}
      <Route path="/courses" element={
        <ProtectedRoute user={user}>
          <CoursesPage />
        </ProtectedRoute>
      } />
      <Route path="/courses/:id" element={
        <ProtectedRoute user={user}>
          <CourseDetailsPage user={user} />
        </ProtectedRoute>
      } />
      <Route path="/courses/:courseId/lessons/:lessonId" element={
        <ProtectedRoute user={user}>
          <LessonDetailsPage />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute user={user}>
          <ProfilePage />
        </ProtectedRoute>
      } />

      {/* Student */}
      <Route path="/student/dashboard" element={
        <ProtectedRoute user={user} allowedRoles={['STUDENT']}>
          <StudentDashboardPage />
        </ProtectedRoute>
      } />
      <Route path="/student/my-courses" element={
        <ProtectedRoute user={user} allowedRoles={['STUDENT']}>
          <StudentMyCoursesPage />
        </ProtectedRoute>
      } />

      {/* Instructor */}
      <Route path="/instructor/dashboard" element={
        <ProtectedRoute user={user} allowedRoles={['INSTRUCTOR', 'ADMIN']}>
          <InstructorDashboardPage />
        </ProtectedRoute>
      } />
      <Route path="/instructor/my-courses" element={
        <ProtectedRoute user={user} allowedRoles={['INSTRUCTOR', 'ADMIN']}>
          <InstructorMyCoursesPage user={user!} />
        </ProtectedRoute>
      } />
      <Route path="/instructor/courses/create" element={
        <ProtectedRoute user={user} allowedRoles={['INSTRUCTOR', 'ADMIN']}>
          <CreateCoursePage />
        </ProtectedRoute>
      } />
      <Route path="/instructor/courses/:id/edit" element={
        <ProtectedRoute user={user} allowedRoles={['INSTRUCTOR', 'ADMIN']}>
          <EditCoursePage />
        </ProtectedRoute>
      } />
      <Route path="/instructor/courses/:id/lessons" element={
        <ProtectedRoute user={user} allowedRoles={['INSTRUCTOR', 'ADMIN']}>
          <ManageLessonsPage />
        </ProtectedRoute>
      } />

      {/* Admin */}
      <Route path="/admin/topics" element={
        <ProtectedRoute user={user} allowedRoles={['ADMIN']}>
          <TopicsPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/dashboard" element={
        <ProtectedRoute user={user} allowedRoles={['ADMIN']}>
          <AdminDashboardPage />
        </ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
