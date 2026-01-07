import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/admin/ProtectedRoute';

// Lazy load components for better performance
const Hero = lazy(() => import('./components/Hero'));
const About = lazy(() => import('./components/About'));
const Skills = lazy(() => import('./components/Skills'));
const Projects = lazy(() => import('./components/Projects'));
const NewsSection = lazy(() => import('./components/NewsSection'));
const Contact = lazy(() => import('./components/Contact'));
const ProjectBuilderForm = lazy(() => import('./components/platform/ProjectBuilderForm'));
const RequestService = lazy(() => import('./components/platform/RequestService'));
const DeveloperProfile = lazy(() => import('./components/DeveloperProfile'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminLogin = lazy(() => import('./components/admin/AdminLogin'));
const DashboardHome = lazy(() => import('./components/admin/DashboardHome'));
const ManageProjects = lazy(() => import('./components/admin/ManageProjects'));
const ManageSkills = lazy(() => import('./components/admin/ManageSkills'));
const ManageNews = lazy(() => import('./components/admin/ManageNews'));
const ManageMessages = lazy(() => import('./components/admin/ManageMessages'));
const ManageRequests = lazy(() => import('./components/admin/ManageRequests'));
const ManageUsers = lazy(() => import('./components/admin/ManageUsers'));
const ManageSettings = lazy(() => import('./components/admin/ManageSettings'));
const AnalyticsDashboard = lazy(() => import('./components/admin/AnalyticsDashboard'));
const PortalLogin = lazy(() => import('./components/platform/PortalLogin'));
const UserPortal = lazy(() => import('./components/platform/UserPortal'));

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-dark-950">
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></div>
      </div>
      <p className="text-gray-400 font-cairo">جاري التحميل...</p>
    </div>
  </div>
);

const AppContent = () => {
  const { pathname } = useLocation();
  const isAdminPath = pathname.startsWith('/admin');

  return (
    <div className='min-h-screen bg-dark-950 text-white font-cairo'>
      {!isAdminPath && <Navbar />}
      <AnimatePresence mode='wait'>
        <Routes>
          <Route
            path='/'
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="pt-24 pb-12"
              >
                <Suspense fallback={<LoadingFallback />}>
                  <RequestService />
                </Suspense>
              </motion.div>
            }
          />
          <Route
            path='/developer'
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Suspense fallback={<LoadingFallback />}>
                  <DeveloperProfile />
                </Suspense>
              </motion.div>
            }
          />
          <Route
            path='/builder'
            element={
              <Suspense fallback={<LoadingFallback />}>
                <div className="pt-24 pb-12">
                  <ProjectBuilderForm />
                </div>
              </Suspense>
            }
          />

          <Route
            path='/portal/login'
            element={
              <Suspense fallback={<LoadingFallback />}>
                <PortalLogin />
              </Suspense>
            }
          />

          <Route
            path='/portal/dashboard'
            element={
              <Suspense fallback={<LoadingFallback />}>
                <UserPortal />
              </Suspense>
            }
          />

          {/* Admin Login */}
          <Route
            path='/admin/login'
            element={
              <Suspense fallback={<LoadingFallback />}>
                <AdminLogin />
              </Suspense>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path='/admin/*'
            element={
              <Suspense fallback={<LoadingFallback />}>
                <ProtectedRoute>
                  <AdminLayout>
                    <Routes>
                      <Route index element={<DashboardHome />} />
                      <Route path="projects" element={<ManageProjects />} />
                      <Route path="skills" element={<ManageSkills />} />
                      <Route path="news" element={<ManageNews />} />
                      <Route path="requests" element={<ManageRequests />} />
                      <Route path="messages" element={<ManageMessages />} />
                      <Route path="users" element={<ManageUsers />} />
                      <Route path="analytics" element={<AnalyticsDashboard />} />
                      <Route path="settings" element={<ManageSettings />} />
                    </Routes>
                  </AdminLayout>
                </ProtectedRoute>
              </Suspense>
            }
          />
        </Routes>
      </AnimatePresence>
      {!isAdminPath && <Footer />}
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
