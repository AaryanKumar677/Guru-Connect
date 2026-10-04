/* ==============================
   Search Modal Component - Quick Navigation (Ctrl+K)
   Keyboard-navigable search modal for quick page navigation,
   role-based page listing, quick actions, arrow key navigation, and ESC to close
   ============================== */
import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../App'
import './SearchModal.css'

const SearchModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [query, setQuery] = useState('')
    const [activeIndex, setActiveIndex] = useState(0)
    const inputRef = useRef(null)

    const studentPages = [
        { path: '/student/dashboard', title: 'Dashboard', icon: '🏠', desc: 'Your home page' },
        { path: '/student/profile', title: 'My Profile', icon: <img src="/assets/icons/edit-profile.png" alt="Profile" width="16" height="16" />, desc: 'View and edit profile' },
        { path: '/student/ai-assistant', title: 'GuruAI', icon: <img src="/assets/icons/guru-ai.png" alt="AI" width="16" height="16" />, desc: 'Ask AI for help' },
        { path: '/student/tutors', title: 'Find Tutors', icon: <img src="/assets/icons/tutor-role.png" alt="Tutors" width="16" height="16" />, desc: 'Browse tutor marketplace' },
        { path: '/student/doubts', title: 'My Doubts', icon: <img src="/assets/icons/my-doubts.png" alt="Doubts" width="16" height="16" />, desc: 'View your questions' },
        { path: '/student/subscription', title: 'Subscription', icon: '💎', desc: 'Manage your plan' },
        { path: '/student/settings', title: 'Settings', icon: <img src="/assets/icons/settings.png" alt="Settings" width="16" height="16" />, desc: 'App preferences' },
        { path: '/student/help', title: 'Help & FAQ', icon: '❓', desc: 'Get help' },
    ]

    const tutorPages = [
        { path: '/tutor/dashboard', title: 'Dashboard', icon: '🏠', desc: 'Your home page' },
        { path: '/tutor/profile', title: 'My Profile', icon: <img src="/assets/icons/edit-profile.png" alt="Profile" width="16" height="16" />, desc: 'Manage your profile' },
        { path: '/tutor/sessions', title: 'Sessions', icon: '📅', desc: 'Manage sessions' },
        { path: '/tutor/earnings', title: 'Earnings', icon: <img src="/assets/icons/total-earnings.png" alt="Earnings" width="16" height="16" />, desc: 'View earnings' },
        { path: '/tutor/settings', title: 'Settings', icon: <img src="/assets/icons/settings.png" alt="Settings" width="16" height="16" />, desc: 'App preferences' },
        { path: '/tutor/help', title: 'Help & FAQ', icon: '❓', desc: 'Get help' },
    ]

    const quickActions = [
        { action: 'ask-ai', title: 'Ask GuruAI a Question', icon: <img src="/assets/icons/guru-ai.png" alt="AI" width="16" height="16" />, desc: 'Get instant help' },
        { action: 'new-doubt', title: 'Post a Doubt', icon: '✏️', desc: 'Ask the community' },
        { action: 'book-session', title: 'Book a Session', icon: '📅', desc: 'Schedule with tutor' },
    ]

    const pages = user?.role === 'tutor' ? tutorPages : studentPages

    const filteredResults = query.trim()
        ? [...pages, ...quickActions].filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.desc.toLowerCase().includes(query.toLowerCase())
        )
        : pages.slice(0, 5)

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpen])

    useEffect(() => {
        setActiveIndex(0)
    }, [query])

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setActiveIndex(prev => Math.min(prev + 1, filteredResults.length - 1))
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActiveIndex(prev => Math.max(prev - 1, 0))
        } else if (e.key === 'Enter' && filteredResults[activeIndex]) {
            handleSelect(filteredResults[activeIndex])
        } else if (e.key === 'Escape') {
            onClose()
        }
    }

    const handleSelect = (item) => {
        if (item.path) {
            navigate(item.path)
        } else if (item.action === 'ask-ai') {
            navigate('/student/ai-assistant')
        } else if (item.action === 'book-session') {
            navigate('/student/tutors')
        }
        setQuery('')
        onClose()
    }

    if (!isOpen) return null

    return createPortal(
        <div className="search-modal-overlay" onClick={onClose}>
            <div className="search-modal" onClick={e => e.stopPropagation()}>
                <div className="search-input-wrapper">
                    <span className="search-icon">🔍</span>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search pages, actions..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <kbd className="search-shortcut">ESC</kbd>
                </div>

                <div className="search-results">
                    {filteredResults.length === 0 ? (
                        <div className="search-empty">
                            <span>🔍</span>
                            <p>No results for "{query}"</p>
                        </div>
                    ) : (
                        <>
                            <div className="search-section-title">
                                {query ? 'Results' : 'Quick Navigation'}
                            </div>
                            {filteredResults.map((item, index) => (
                                <button
                                    key={item.path || item.action}
                                    className={`search-result-item ${index === activeIndex ? 'active' : ''}`}
                                    onClick={() => handleSelect(item)}
                                // Removed onMouseEnter to prevent jumpy selection on scroll
                                >
                                    <span className="result-icon">{item.icon}</span>
                                    <div className="result-info">
                                        <span className="result-title">{item.title}</span>
                                        <span className="result-desc">{item.desc}</span>
                                    </div>
                                    <span className="result-arrow">→</span>
                                </button>
                            ))}
                        </>
                    )}
                </div>

                <div className="search-footer">
                    <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
                    <span><kbd>↵</kbd> Select</span>
                    <span><kbd>ESC</kbd> Close</span>
                </div>
            </div>
        </div>,
        document.body
    )
}

export default SearchModal
