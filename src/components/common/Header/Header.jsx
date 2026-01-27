import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme, useAuth } from '../../../App'
import Notifications from '../Notifications/Notifications'
import SearchModal from '../SearchModal/SearchModal'
import './Header.css'

const Header = () => {
    const { theme, toggleTheme } = useTheme()
    const { user, logout, openAuthModal } = useAuth()
    const navigate = useNavigate()
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Keyboard shortcut for search (Ctrl+K or Cmd+K)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault()
                if (user) setIsSearchOpen(true)
            }
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [user])

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
        setIsMobileMenuOpen(false)
    }

    return (
        <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
            <div className="container header-container">
                {/* Logo */}
                <a href="/" className="header-logo">
                    <div className="logo-icon">
                        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#667EEA" />
                                    <stop offset="100%" stopColor="#764BA2" />
                                </linearGradient>
                            </defs>
                            <circle cx="20" cy="20" r="18" stroke="url(#logoGradient)" strokeWidth="3" fill="none" />
                            <path d="M14 16C14 14.8954 14.8954 14 16 14H24C25.1046 14 26 14.8954 26 16V18C26 19.1046 25.1046 20 24 20H16C14.8954 20 14 19.1046 14 18V16Z" fill="url(#logoGradient)" />
                            <path d="M16 23H24" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" />
                            <path d="M18 26H22" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div className="logo-text">
                        <span className="logo-name">Guru Connect</span>
                        <span className="logo-tagline">Knowledge Meets Technology</span>
                    </div>
                </a>

                {/* Desktop Navigation - Only show when not logged in */}
                {!user && (
                    <nav className="header-nav">
                        <button onClick={() => scrollToSection('features')} className="nav-link">Features</button>
                        <button onClick={() => scrollToSection('why-us')} className="nav-link">Why Us</button>
                        <button onClick={() => scrollToSection('facilities')} className="nav-link">Facilities</button>
                        <button onClick={() => scrollToSection('users')} className="nav-link">For You</button>
                    </nav>
                )}

                {/* Right Actions */}
                <div className="header-actions">
                    {/* Theme Toggle */}
                    <button
                        className="theme-toggle"
                        onClick={toggleTheme}
                        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    >
                        {theme === 'light' ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="5" />
                                <line x1="12" y1="1" x2="12" y2="3" />
                                <line x1="12" y1="21" x2="12" y2="23" />
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                <line x1="1" y1="12" x2="3" y2="12" />
                                <line x1="21" y1="12" x2="23" y2="12" />
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                            </svg>
                        )}
                    </button>

                    {user ? (
                        <div className="user-menu">
                            <button
                                className="search-trigger"
                                onClick={() => setIsSearchOpen(true)}
                                title="Search (Ctrl+K)"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.35-4.35" />
                                </svg>
                                <span className="search-placeholder">Search...</span>
                                <kbd>⌘K</kbd>
                            </button>
                            <Notifications />

                            {/* User Avatar Dropdown */}
                            <div className="user-dropdown-container" style={{ position: 'relative' }}>
                                <button
                                    className="user-avatar-btn"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    aria-label="User menu"
                                    aria-expanded={isDropdownOpen}
                                >
                                    <div className="user-avatar">
                                        {user.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                </button>

                                {isDropdownOpen && (
                                    <>
                                        <div
                                            className="dropdown-backdrop"
                                            onClick={() => setIsDropdownOpen(false)}
                                            style={{
                                                position: 'fixed',
                                                inset: 0,
                                                zIndex: 40
                                            }}
                                        />
                                        <div className="user-dropdown-menu">
                                            <div className="dropdown-header">
                                                <span className="dropdown-name">{user.name || 'User'}</span>
                                                <span className="dropdown-role">{user.role || 'Student'}</span>
                                            </div>
                                            <div className="dropdown-divider" />
                                            <button
                                                onClick={() => {
                                                    navigate(user.role === 'tutor' ? '/tutor/profile' : '/student/profile')
                                                    setIsDropdownOpen(false)
                                                }}
                                                className="dropdown-item"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                    <circle cx="12" cy="7" r="4" />
                                                </svg>
                                                My Profile
                                            </button>
                                            <button onClick={logout} className="dropdown-item dropdown-logout">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                                    <polyline points="16 17 21 12 16 7" />
                                                    <line x1="21" y1="12" x2="9" y2="12" />
                                                </svg>
                                                Logout
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={() => openAuthModal('login')}
                                className="btn btn-ghost"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => openAuthModal('signup')}
                                className="btn btn-primary"
                            >
                                Sign Up
                            </button>
                        </>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="mobile-menu-toggle"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                        aria-expanded={isMobileMenuOpen}
                    >
                        <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                {!user && (
                    <nav className="mobile-nav">
                        <button onClick={() => scrollToSection('features')} className="mobile-nav-link">Features</button>
                        <button onClick={() => scrollToSection('why-us')} className="mobile-nav-link">Why Us</button>
                        <button onClick={() => scrollToSection('facilities')} className="mobile-nav-link">Facilities</button>
                        <button onClick={() => scrollToSection('users')} className="mobile-nav-link">For You</button>
                    </nav>
                )}
                {!user && (
                    <div className="mobile-auth-buttons">
                        <button
                            onClick={() => { openAuthModal('login'); setIsMobileMenuOpen(false); }}
                            className="btn btn-secondary"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => { openAuthModal('signup'); setIsMobileMenuOpen(false); }}
                            className="btn btn-primary"
                        >
                            Sign Up
                        </button>
                    </div>
                )}
            </div>

            {/* Search Modal */}
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </header>
    )
}

export default Header
