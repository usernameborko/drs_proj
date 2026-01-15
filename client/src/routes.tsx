import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import UserListPage from './pages/UserListPage';
import ProtectedRoute from './components/ProtectedRoute';

const AppRoutes: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <UserListPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  </Router>
);

export default AppRoutes;
