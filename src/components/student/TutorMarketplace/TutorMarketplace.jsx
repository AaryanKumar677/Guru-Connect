import { useState } from 'react'
import './TutorMarketplace.css'

const TutorMarketplace = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedSubject, setSelectedSubject] = useState('all')
    const [selectedRating, setSelectedRating] = useState('all')
    const [priceRange, setPriceRange] = useState('all')

    const subjects = ['All Subjects', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science', 'History']

    const tutors = [
        { id: 1, name: 'Dr. Priya Sharma', subject: 'Mathematics', rating: 4.9, sessions: 120, avatar: '👩‍🏫', price: 10, bio: 'PhD in Mathematics with 10+ years of teaching experience. Specialized in calculus and algebra.', languages: ['English', 'Hindi'], available: true },
        { id: 2, name: 'Prof. Rajesh Kumar', subject: 'Physics', rating: 4.8, sessions: 95, avatar: '👨‍🏫', price: 12, bio: 'Former IIT professor with expertise in mechanics and thermodynamics.', languages: ['English', 'Hindi'], available: true },
        { id: 3, name: 'Ms. Anjali Gupta', subject: 'Chemistry', rating: 4.7, sessions: 80, avatar: '👩‍🔬', price: 8, bio: 'Chemistry expert focusing on organic chemistry and practical applications.', languages: ['English'], available: false },
        { id: 4, name: 'Mr. Vikram Singh', subject: 'Biology', rating: 4.9, sessions: 110, avatar: '🧑‍🔬', price: 10, bio: 'Medical doctor turned educator. Makes complex concepts easy to understand.', languages: ['English', 'Hindi'], available: true },
        { id: 5, name: 'Dr. Sarah Johnson', subject: 'English', rating: 4.6, sessions: 75, avatar: '👩‍💼', price: 15, bio: 'Native English speaker with expertise in literature and grammar.', languages: ['English'], available: true },
        { id: 6, name: 'Mr. Arjun Patel', subject: 'Computer Science', rating: 4.8, sessions: 88, avatar: '👨‍💻', price: 14, bio: 'Software engineer with 8 years of industry experience. Expert in Python and Java.', languages: ['English', 'Hindi', 'Gujarati'], available: true },
    ]

    const filteredTutors = tutors.filter(tutor => {
        const matchesSearch = tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tutor.subject.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesSubject = selectedSubject === 'all' || tutor.subject === selectedSubject
        const matchesRating = selectedRating === 'all' || tutor.rating >= parseFloat(selectedRating)
        return matchesSearch && matchesSubject && matchesRating
    })

    return (
        <div className="marketplace-page">
            {/* Header */}
            <div className="page-header">
                <h1 className="page-title">Find Your Perfect Tutor</h1>
                <p className="page-subtitle">Browse our expert tutors and book a session</p>
            </div>

            {/* Search & Filters */}
            <div className="marketplace-filters">
                <div className="search-box">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search tutors by name or subject..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Subjects</option>
                        {subjects.slice(1).map(subject => (
                            <option key={subject} value={subject}>{subject}</option>
                        ))}
                    </select>

                    <select
                        value={selectedRating}
                        onChange={(e) => setSelectedRating(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">Any Rating</option>
                        <option value="4.5">4.5+ Stars</option>
                        <option value="4.0">4.0+ Stars</option>
                        <option value="3.5">3.5+ Stars</option>
                    </select>

                    <select
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">Any Price</option>
                        <option value="low">Under 10 pts</option>
                        <option value="mid">10-15 pts</option>
                        <option value="high">15+ pts</option>
                    </select>
                </div>
            </div>

            {/* Results Count */}
            <div className="results-info">
                <span>{filteredTutors.length} tutors found</span>
            </div>

            {/* Tutors Grid */}
            <div className="tutors-grid">
                {filteredTutors.map(tutor => (
                    <div key={tutor.id} className="tutor-card">
                        <div className="tutor-card-header">
                            <div className="tutor-avatar-large">{tutor.avatar}</div>
                            <div className={`availability-badge ${tutor.available ? 'online' : 'offline'}`}>
                                {tutor.available ? 'Available' : 'Busy'}
                            </div>
                        </div>

                        <div className="tutor-card-body">
                            <h3 className="tutor-name">{tutor.name}</h3>
                            <span className="tutor-subject-tag">{tutor.subject}</span>
                            <p className="tutor-bio">{tutor.bio}</p>

                            <div className="tutor-stats-row">
                                <div className="tutor-stat">
                                    <span className="stat-icon"><img src="/assets/icons/average-rating.png" alt="Rating" width="16" height="16" style={{ verticalAlign: 'middle' }} /></span>
                                    <span className="stat-value">{tutor.rating}</span>
                                </div>
                                <div className="tutor-stat">
                                    <span className="stat-icon">📚</span>
                                    <span className="stat-value">{tutor.sessions} sessions</span>
                                </div>
                            </div>

                            <div className="tutor-languages">
                                {tutor.languages.map(lang => (
                                    <span key={lang} className="language-tag">{lang}</span>
                                ))}
                            </div>
                        </div>

                        <div className="tutor-card-footer">
                            <div className="tutor-price">
                                <span className="price-value">{tutor.price}</span>
                                <span className="price-unit">pts/session</span>
                            </div>
                            <div className="tutor-actions">
                                <button className="btn btn-secondary btn-sm">
                                    <img src="/assets/icons/chat.png" alt="Chat" width="16" height="16" style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Chat
                                </button>
                                <button className="btn btn-primary btn-sm">📅 Book</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredTutors.length === 0 && (
                <div className="empty-state">
                    <span className="empty-icon">🔍</span>
                    <h3>No tutors found</h3>
                    <p>Try adjusting your filters or search query</p>
                </div>
            )}
        </div>
    )
}

export default TutorMarketplace
