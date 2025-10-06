import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { NotificationSnackbar } from './components/NotificationSnackbar'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { EmailVerification } from './pages/EmailVerification'
import { JobDetail } from './pages/JobDetail'
import { NotFound } from './pages/NotFound'

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-email" element={<EmailVerification />} />
            <Route path="/job/:jobId" element={
              <ProtectedRoute>
                <JobDetail />
              </ProtectedRoute>
            } />
            <Route path="/not-found" element={<NotFound />} />
            <Route path="/" element={<Navigate to="/not-found" replace />} />
            <Route path="*" element={<Navigate to="/not-found" replace />} />
          </Routes>
          <NotificationSnackbar />
        </Router>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App