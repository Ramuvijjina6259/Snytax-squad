import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

// Layouts
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import AdminSidebar from './components/admin/AdminSidebar';
import ProtectedRoute from './components/admin/ProtectedRoute';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Team from './pages/public/Team';
import MemberProfile from './pages/public/MemberProfile';
import Projects from './pages/public/Projects';
import ProjectDetails from './pages/public/ProjectDetails';
import Skills from './pages/public/Skills';
import Achievements from './pages/public/Achievements';
import Contact from './pages/public/Contact';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import MembersAdmin from './pages/admin/Members';
import ProjectsAdmin from './pages/admin/Projects';
import SkillsAdmin from './pages/admin/Skills';
import AchievementsAdmin from './pages/admin/Achievements';
import MessagesAdmin from './pages/admin/Messages';
import SettingsAdmin from './pages/admin/Settings';

// Public Layout
function PublicLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// Admin Layout
function AdminLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <main className="admin-content" style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/team" element={<Team />} />
              <Route path="/team/:slug" element={<MemberProfile />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:slug" element={<ProjectDetails />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Admin Authentication */}
            <Route path="/admin/login" element={<Login />} />

            {/* Admin Management Panel */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="members" element={<MembersAdmin />} />
              <Route path="projects" element={<ProtectedRoute adminOnly><ProjectsAdmin /></ProtectedRoute>} />
              <Route path="skills" element={<ProtectedRoute adminOnly><SkillsAdmin /></ProtectedRoute>} />
              <Route path="achievements" element={<AchievementsAdmin />} />
              <Route path="messages" element={<ProtectedRoute adminOnly><MessagesAdmin /></ProtectedRoute>} />
              <Route path="settings" element={<ProtectedRoute adminOnly><SettingsAdmin /></ProtectedRoute>} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        <Toaster position="bottom-right" />
      </AuthProvider>
    </ThemeProvider>
  );
}
