import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import BlogList from './components/BlogList'
import BlogAddPage from './components/BlogAddPage'
import BlogEditPage from './components/BlogEditPage'

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function App() {
  const [navOpen, setNavOpen] = useState(false)
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
          <Link to="/" className="app-nav-link" onClick={closeNav}>All blogs</Link>
          <Link to="/add" className="app-nav-link" onClick={closeNav}>Add blog</Link>
        </nav>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/add" element={<BlogAddPage />} />
          <Route path="/edit/:id" element={<BlogEditPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
