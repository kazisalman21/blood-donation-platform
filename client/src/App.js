import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Shared components
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import ProtectedRoute from './components/shared/ProtectedRoute';
import AdminRoute from './components/shared/AdminRoute';

// Pages — Donor (Salman)
import RegisterPage from './components/donor/RegisterPage';
import LoginPage from './components/donor/LoginPage';
import DonorProfilePage from './components/donor/DonorProfilePage';
import VerificationRequestForm from './components/donor/VerificationRequestForm';

// Pages — Patient (Athoy)
import PostRequestPage from './components/patient/PostRequestPage';
import MyRequestsPage from './components/patient/MyRequestsPage';
import RequestDetailPage from './components/patient/RequestDetailPage';
import DonorMapPage from './components/patient/DonorMapPage';
import StatusTrackerPage from './components/patient/StatusTrackerPage';
import InventoryPage from './components/patient/InventoryPage';
import AnalyticsDashboard from './components/patient/AnalyticsDashboard';
import BroadcastPage from './components/patient/BroadcastPage';

// Pages — Community (Anika)
import DonationHistoryPage from './components/community/DonationHistoryPage';
import RequestHistoryPage from './components/community/RequestHistoryPage';
import LeaderboardPage from './components/community/LeaderboardPage';
import FAQPage from './components/community/FAQPage';
import BloodCompatibilityChartPage from './components/community/BloodCompatibilityChartPage';

// Pages — Admin (Anika)
import AdminContentEditor from './components/admin/AdminContentEditor';

// Pages — Admin (Salman)
import AdminUsersPage from './components/admin/AdminUsersPage';

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

              {/* Protected Routes — Patient (Athoy: F8, F9) */}
              <Route path="/request/new" element={
                <ProtectedRoute><PostRequestPage /></ProtectedRoute>
              } />
              <Route path="/requests/my" element={
                <ProtectedRoute><MyRequestsPage /></ProtectedRoute>
              } />
              <Route path="/requests/:id" element={
                <ProtectedRoute><RequestDetailPage /></ProtectedRoute>
              } />

              {/* Protected Routes — Athoy: F10, F11 */}
              <Route path="/donor-map" element={
                <ProtectedRoute><DonorMapPage /></ProtectedRoute>
              } />
              <Route path="/status-tracker" element={
                <ProtectedRoute><StatusTrackerPage /></ProtectedRoute>
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

              {/* Protected Routes — Donor Verification (Salman: F6) */}
              <Route path="/verification" element={
                <ProtectedRoute><VerificationRequestForm /></ProtectedRoute>
              } />

              {/* Admin Routes — Content Management */}
              <Route path="/admin/content" element={
                <AdminRoute><AdminContentEditor /></AdminRoute>
              } />

              {/* Admin Routes — User Management (Salman: F16) */}
              <Route path="/admin/users" element={
                <AdminRoute><AdminUsersPage /></AdminRoute>
              } />

              {/* Admin Routes — Athoy: F17, F18, F19 */}
              <Route path="/admin/inventory" element={
                <AdminRoute><InventoryPage /></AdminRoute>
              } />
              <Route path="/admin/analytics" element={
                <AdminRoute><AnalyticsDashboard /></AdminRoute>
              } />
              <Route path="/admin/broadcast" element={
                <AdminRoute><BroadcastPage /></AdminRoute>
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
