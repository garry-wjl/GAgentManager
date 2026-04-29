import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AgentManagement from './pages/AgentManagement'
import UserManagement from './pages/UserManagement'
import PermissionManagement from './pages/PermissionManagement'
import SkillStore from './pages/SkillStore'
import MCPManagement from './pages/MCPManagement'
import ModelManagement from './pages/ModelManagement'
import SystemSettings from './pages/SystemSettings'
import ProtectedRoute from './routes/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="agents" element={<AgentManagement />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="permissions" element={<PermissionManagement />} />
        <Route path="skills" element={<SkillStore />} />
        <Route path="mcps" element={<MCPManagement />} />
        <Route path="models" element={<ModelManagement />} />
        <Route path="settings" element={<SystemSettings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
