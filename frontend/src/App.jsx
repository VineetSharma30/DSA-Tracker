import { Routes, Route } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import {Login, Dashboard, Problems, Analytics} from './pages/pages'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>
    </Routes>
    </>
  )
}

export default App