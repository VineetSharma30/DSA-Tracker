import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import {Login, Register, Dashboard, Problems, Analytics, Analytics2, Friends, Profile, Goals, Contests, Settings} from './pages/Pages.jsx'
import { useAuth } from './context/AuthContext.jsx'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/" replace />
}


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route path="/problems" element={<Problems />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/analytics2" element={<Analytics2 />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/profile" element={<Profile />}/>
          <Route path="/goals" element={<Goals />}/>
          <Route path="/contests" element={<Contests />}/>
          <Route path="/settings" element={<Settings />} />

        </Route>
    </Routes>
    </>
  )
}

export default App