import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Shared components
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import ProtectedRoute from './components/shared/ProtectedRoute';

// Pages — Donor (Salman)
import RegisterPage from './components/donor/RegisterPage';
import LoginPage from './components/donor/LoginPage';
import DonorProfilePage from './components/donor/DonorProfilePage';

// Pages — Patient (Athoy)
import PostRequestPage from './components/patient/PostRequestPage';

// Pages — Community (Anika)
import DonationHistoryPage from './components/community/DonationHistoryPage';
import RequestHistoryPage from './components/community/RequestHistoryPage';
import LeaderboardPage from './components/community/LeaderboardPage';
import FAQPage from './components/community/FAQPage';
import BloodCompatibilityChartPage from './components/community/BloodCompatibilityChartPage';

// Pages — Admin (Anika)
import AdminContentEditor from './components/admin/AdminContentEditor';

// Pages — Public
import HomePage from './pages/HomePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Routes — Donor */}
              <Route path="/profile" element={
                <ProtectedRoute><DonorProfilePage /></ProtectedRoute>
              } />

              {/* Protected Routes — Patient */}
              <Route path="/request/new" element={
                <ProtectedRoute><PostRequestPage /></ProtectedRoute>
              } />

              {/* Protected Routes — Community */}
              <Route path="/history/donations" element={
                <ProtectedRoute><DonationHistoryPage /></ProtectedRoute>
              } />
              <Route path="/history/requests" element={
                <ProtectedRoute><RequestHistoryPage /></ProtectedRoute>
              } />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/blood-compatibility" element={<BloodCompatibilityChartPage />} />

              {/* Admin Routes — Content Management */}
              <Route path="/admin/content" element={
                <ProtectedRoute><AdminContentEditor /></ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
