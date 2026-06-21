import { Routes, Route } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import {Login, Register, Dashboard, Problems, Analytics, Profile, Goals, Contests, Settings} from './pages/Pages.jsx'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/analytics" element={<Analytics />} />
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