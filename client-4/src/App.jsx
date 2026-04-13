import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { lazy, Suspense, Component } from 'react';

// Error Boundary
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f6fb', padding: 24 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '48px 40px', maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>⚠️</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>Something went wrong</h2>
            <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.7, marginBottom: 28 }}>
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <button onClick={() => window.location.reload()} className="btn btn-primary" style={{ padding: '12px 32px', fontSize: 15 }}>
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Loading fallback
const PageLoader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f4f6fb' }}>
    <div className="spinner" />
  </div>
);

// 404 Page
const NotFoundPage = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f6fb', padding: 24 }}>
    <div style={{ background: '#fff', borderRadius: 16, padding: '48px 40px', maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
      <div style={{ fontSize: 80, fontWeight: 900, color: '#e94560', lineHeight: 1 }}>404</div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10, marginTop: 12 }}>Page Not Found</h2>
      <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.7, marginBottom: 28 }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary" style={{ padding: '12px 32px', fontSize: 15, textDecoration: 'none' }}>
        Go to Home
      </Link>
    </div>
  </div>
);

// Lazy loaded pages
const Home     = lazy(() => import('./pages/public/Home'));
const About    = lazy(() => import('./pages/public/About'));
const Coaches  = lazy(() => import('./pages/public/Coaches'));
const Gym      = lazy(() => import('./pages/public/Gym'));
const Pricing  = lazy(() => import('./pages/public/Pricing'));
const Contact  = lazy(() => import('./pages/public/Contact'));

const Login    = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword  = lazy(() => import('./pages/ResetPassword'));

const StudentDashboard  = lazy(() => import('./pages/student/Dashboard'));
const StudentPayment    = lazy(() => import('./pages/student/Payment'));
const StudentAttendance = lazy(() => import('./pages/student/Attendance'));
const StudentProfile    = lazy(() => import('./pages/student/Profile'));
const StudentNotices    = lazy(() => import('./pages/student/Notices'));

const AdminDashboard     = lazy(() => import('./pages/admin/Dashboard'));
const AdminStudents      = lazy(() => import('./pages/admin/Students'));
const AdminStudentDetail = lazy(() => import('./pages/admin/StudentDetail'));
const AdminFees          = lazy(() => import('./pages/admin/Fees'));
const AdminPayments      = lazy(() => import('./pages/admin/Payments'));
const AdminAttendance    = lazy(() => import('./pages/admin/Attendance'));
const AdminNotices       = lazy(() => import('./pages/admin/Notices'));
const AdminEnrollments   = lazy(() => import('./pages/admin/Enrollments'));

const ProtectedRoute = ({ children, adminRequired }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (adminRequired && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(196,150,74,0.3)' } }} />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public routes */}
              <Route path="/"         element={<Home />} />
              <Route path="/about"    element={<About />} />
              <Route path="/coaches"  element={<Coaches />} />
              <Route path="/gym"      element={<Gym />} />
              <Route path="/pricing"  element={<Pricing />} />
              <Route path="/contact"  element={<Contact />} />

              {/* Auth routes */}
              <Route path="/login"           element={<Login />} />
              <Route path="/register"        element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />

              {/* Student routes */}
              <Route path="/dashboard"  element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
              <Route path="/payment"    element={<ProtectedRoute><StudentPayment /></ProtectedRoute>} />
              <Route path="/attendance" element={<ProtectedRoute><StudentAttendance /></ProtectedRoute>} />
              <Route path="/profile"    element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />
              <Route path="/notices"    element={<ProtectedRoute><StudentNotices /></ProtectedRoute>} />

              {/* Admin routes */}
              <Route path="/admin"               element={<ProtectedRoute adminRequired><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/students"      element={<ProtectedRoute adminRequired><AdminStudents /></ProtectedRoute>} />
              <Route path="/admin/students/:id"  element={<ProtectedRoute adminRequired><AdminStudentDetail /></ProtectedRoute>} />
              <Route path="/admin/fees"          element={<ProtectedRoute adminRequired><AdminFees /></ProtectedRoute>} />
              <Route path="/admin/payments"      element={<ProtectedRoute adminRequired><AdminPayments /></ProtectedRoute>} />
              <Route path="/admin/attendance"    element={<ProtectedRoute adminRequired><AdminAttendance /></ProtectedRoute>} />
              <Route path="/admin/notices"       element={<ProtectedRoute adminRequired><AdminNotices /></ProtectedRoute>} />
              <Route path="/admin/enrollments"   element={<ProtectedRoute adminRequired><AdminEnrollments /></ProtectedRoute>} />

              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
