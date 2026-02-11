import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/navbar/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import UserListPage from "./pages/UserListPage";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateQuizPage from "./pages/moderator/CreateQuizPage";
import QuizApprovalPage from "./pages/admin/QuizApprovalPage";
import PlayerQuizzesPage from "./pages/player/PlayerQuizzesPage";
import PlayQuizPage from "./pages/player/PlayQuizPage";
import LeaderboardPage from "./pages/leaderboard/LeaderboardPage";
import ModeratorsQuizPage from "./pages/moderator/ModeratorsQuizPage";


const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
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

        <Route
          path="/moderator/create-quiz"
          element={
            <ProtectedRoute>
              <CreateQuizPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/quizzes"
          element={
            <ProtectedRoute>
              <QuizApprovalPage />
            </ProtectedRoute>
          }
        />

        <Route
           path="/quizzes"
          element={
            <ProtectedRoute>
              <PlayerQuizzesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quiz/:id/play"
          element={
            <ProtectedRoute>
              <PlayQuizPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard/:quizId"
          element={
            <ProtectedRoute>
              <LeaderboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/moderator/quizzes"
          element={
            <ProtectedRoute>
              <ModeratorsQuizPage />
            </ProtectedRoute>
          }
        />

        {/* Dodati i “Not Found” rutu */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;