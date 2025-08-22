import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Feed from './pages/Feed'
import Profile from './pages/Profile'
import Jobs from './pages/Jobs'
import Chat from './pages/Chat'
import Admin from './pages/Admin'
import UsersList from './pages/UsersList'   // 🆕 import UsersList
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { useSelector } from 'react-redux'
import { ThemeProvider } from './components/ui/theme-provider'
import { Toaster } from './components/ui/sonner'

export default function App() {
  const token = useSelector(s => s.auth.token)
  const location = useLocation()

  return (
    <ThemeProvider defaultTheme="system" storageKey="global-connect-theme">
      <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-300">
        <Navbar />
        <Toaster richColors position="top-center" />
        <div className="flex-1 max-w-5xl w-full mx-auto p-4">
          <Routes>
            <Route path="/" element={token ? <Feed /> : <Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile/:id?" element={<Profile />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/chat/:peerId?" element={<Chat />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  )
}
