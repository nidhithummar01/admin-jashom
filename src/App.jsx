import { useState } from 'react'
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import BlogList from './components/BlogList'
import BlogAddPage from './components/BlogAddPage'
import BlogEditPage from './components/BlogEditPage'
import JobList from './components/JobList'
import JobAddPage from './components/JobAddPage'
import JobEditPage from './components/JobEditPage'
import LoginPage from './components/LoginPage'
import { isAuthenticated, clearAuth, getAdmin } from './auth.js'

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) return <Navigate to="/login" replace />
  return children
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function AppLayout() {
  const navigate = useNavigate()
  const admin = getAdmin()
  const [navOpen, setNavOpen] = useState(false)

  const handleLogout = () => {
    clearAuth()
    setNavOpen(false)
    navigate('/login', { replace: true })
  }

  const closeNav = () => setNavOpen(false)

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Admin Jashom</h1>
        <button
          type="button"
          className="app-nav-toggle"
          onClick={() => setNavOpen((o) => !o)}
          aria-expanded={navOpen}
          aria-label="Toggle menu"
        >
          <MenuIcon />
        </button>
        <nav className={`app-nav ${navOpen ? 'app-nav--open' : ''}`}>
          <span className="app-nav-section">Blogs</span>
          <Link to="/" className="app-nav-link" onClick={closeNav}>All Blogs</Link>
          <Link to="/add" className="app-nav-link" onClick={closeNav}>Add Blog</Link>
          <span className="app-nav-section">Jobs</span>
          <Link to="/jobs" className="app-nav-link" onClick={closeNav}>All Jobs</Link>
          <Link to="/jobs/add" className="app-nav-link" onClick={closeNav}>Add Job</Link>
          {admin?.email && (
            <span className="app-nav-user">{admin.email}</span>
          )}
          <button type="button" onClick={handleLogout} className="app-nav-logout">
            Logout
          </button>
        </nav>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/add" element={<BlogAddPage />} />
          <Route path="/edit/:id" element={<BlogEditPage />} />
          <Route path="/jobs" element={<JobList />} />
          <Route path="/jobs/add" element={<JobAddPage />} />
          <Route path="/jobs/edit/:id" element={<JobEditPage />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/*" element={<ProtectedRoute><AppLayout /></ProtectedRoute>} />
    </Routes>
  )
}

export default App
