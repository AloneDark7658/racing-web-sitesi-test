import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import LeaveRequest from './pages/LeaveRequest';
import AdminLeaves from './pages/AdminLeaves';
import AdminDepartments from './pages/AdminDepartments';
import AdminAttendanceLog from './pages/AdminAttendanceLog';
import AdminQR from './pages/AdminQR';
import DirectScan from './pages/DirectScan';
import MyPerformance from './pages/MyPerformance';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Routes>
        {/* Herkese açık rotalar */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Giriş yapılmış kullanıcılar */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/leave-request" element={<ProtectedRoute><LeaveRequest /></ProtectedRoute>} />
        <Route path="/my-performance" element={<ProtectedRoute><MyPerformance /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/direct-scan/:qrToken" element={<ProtectedRoute><DirectScan /></ProtectedRoute>} />

        {/* Sadece Admin rotaları */}
        <Route path="/admin/qr-generate" element={<AdminRoute><AdminQR /></AdminRoute>} />
        <Route path="/admin/attendance-log" element={<AdminRoute><AdminAttendanceLog /></AdminRoute>} />
        <Route path="/admin/leaves" element={<AdminRoute><AdminLeaves /></AdminRoute>} />
        <Route path="/admin/departments" element={<AdminRoute><AdminDepartments /></AdminRoute>} />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;