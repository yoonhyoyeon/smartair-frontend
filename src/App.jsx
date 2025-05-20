import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout'
import DashboardLayout from './layouts/DashboardLayout'
import Login from './pages/auth/Login'
import DashboardHome from './pages/dashboard/Home'
import DashboardAnalyze from './pages/dashboard/Analyze'
import DashboardMore from './pages/dashboard/More'
import DashboardSetting from './pages/dashboard/Setting'
import Signup from './pages/auth/Signup'
import ProtectedRoute from './components/ProtectedRoute'
import { useEffect, useState } from 'react'
function App() {
  return (
    <Router>
      <Routes>
        {/* 인증 관련 라우트 */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* 대시보드 라우트 */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/home" element={<DashboardHome />} />
            <Route path="/analyze" element={<DashboardAnalyze />} />
            <Route path="/more" element={<DashboardMore />} />
            <Route path="/setting" element={<DashboardSetting />} />
          </Route>
        </Route>

        {/* 기본 리다이렉트 */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
