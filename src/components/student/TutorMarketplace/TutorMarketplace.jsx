import { useState, useEffect } from 'react'
import { useAuth } from '../../../App'
import { subscribeTutors, getOrCreateChat, subscribeToUserPresence } from '../../../services/firebaseService'
import OnlineIndicator from '../../common/OnlineIndicator/OnlineIndicator'
import ChatPanel from '../../common/Chat/ChatPanel'
import VideoCall, { VideoCallButton } from '../../common/VideoCall/VideoCall'
import './TutorMarketplace.css'

// Mock tutors for demo (will be replaced with real data when Firebase is configured)
const mockTutors = [
    { id: 'tutor1', name: 'Dr. Priya Sharma', subject: 'Mathematics', rating: 4.9, sessions: 120, avatar: '👩‍🏫', price: 10, bio: 'PhD in Mathematics with 10+ years of teaching experience. Specialized in calculus and algebra.', languages: ['English', 'Hindi'], presence: { online: true } },
    { id: 'tutor2', name: 'Prof. Rajesh Kumar', subject: 'Physics', rating: 4.8, sessions: 95, avatar: '👨‍🏫', price: 12, bio: 'Former IIT professor with expertise in mechanics and thermodynamics.', languages: ['English', 'Hindi'], presence: { online: true } },
    { id: 'tutor3', name: 'Ms. Anjali Gupta', subject: 'Chemistry', rating: 4.7, sessions: 80, avatar: '👩‍🔬', price: 8, bio: 'Chemistry expert focusing on organic chemistry and practical applications.', languages: ['English'], presence: { online: false, lastSeen: new Date(Date.now() - 3600000) } },
    { id: 'tutor4', name: 'Mr. Vikram Singh', subject: 'Biology', rating: 4.9, sessions: 110, avatar: '🧑‍🔬', price: 10, bio: 'Medical doctor turned educator. Makes complex concepts easy to understand.', languages: ['English', 'Hindi'], presence: { online: true } },
    { id: 'tutor5', name: 'Dr. Sarah Johnson', subject: 'English', rating: 4.6, sessions: 75, avatar: '👩‍💼', price: 15, bio: 'Native English speaker with expertise in literature and grammar.', languages: ['English'], presence: { online: false, lastSeen: new Date(Date.now() - 7200000) } },
    { id: 'tutor6', name: 'Mr. Arjun Patel', subject: 'Computer Science', rating: 4.8, sessions: 88, avatar: '👨‍💻', price: 14, bio: 'Software engineer with 8 years of industry experience. Expert in Python and Java.', languages: ['English', 'Hindi', 'Gujarati'], presence: { online: true } },
]

const TutorMarketplace = () => {
    const { user } = useAuth()
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedSubject, setSelectedSubject] = useState('all')
    const [selectedRating, setSelectedRating] = useState('all')
    const [priceRange, setPriceRange] = useState('all')
    const [onlineOnly, setOnlineOnly] = useState(false)
    const [tutors, setTutors] = useState(mockTutors)
    const [chatOpen, setChatOpen] = useState(false)
    const [chatRecipientId, setChatRecipientId] = useState(null)
    const [videoCallRoom, setVideoCallRoom] = useState(null)

    const subjects = ['All Subjects', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science', 'History']

    // Store presence unsubscribers
    const [presenceUnsubscribers, setPresenceUnsubscribers] = useState({});

    // Try to load real tutors from Firebase
    useEffect(() => {
        let tutorUnsubscribe = null;
        const presenceUnsubs = {};

        try {
            tutorUnsubscribe = subscribeTutors((realTutors) => {
                // Combine real tutors with mock tutors
                // Mark real tutors to sort them first and normalize data
                const markedRealTutors = realTutors.map(t => ({
                    ...t,
                    isReal: true,
                    // Default values for fields that might be missing in new profiles
                    rating: t.rating || 0, // Show 0 or New for new tutors
                    sessions: t.sessions || 0,
                    avatar: (t.photoURL || (typeof t.avatar === 'string' && (t.avatar.startsWith('http') || t.avatar.startsWith('/')))) ? <img src={t.photoURL || t.avatar} alt={t.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : (t.avatar || '👨‍🏫'),
                    bio: t.bio || 'Passionate educator ready to help you learn.',
                    languages: t.languages || ['English'],
                    price: t.price || 15, // Default price
                    subject: t.subject || 'General'
                }));

                // Use a Map to distinct tutors by ID in case of overlap
                const combined = [...markedRealTutors, ...mockTutors];
                const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());

                setTutors(unique);

                // Subscribe to real-time presence for each real tutor
                markedRealTutors.forEach(tutor => {
                    if (!presenceUnsubs[tutor.id]) {
                        presenceUnsubs[tutor.id] = subscribeToUserPresence(tutor.id, (presence) => {
                            setTutors(prev => prev.map(t =>
                                t.id === tutor.id ? { ...t, presence } : t
                            ));
                        });
                    }
                });
            });
        } catch (error) {
            // Firebase not configured, use mock data
            console.log('Using mock tutors (Firebase not configured)')
        }

        return () => {
            tutorUnsubscribe?.();
            // Cleanup all presence subscriptions
            Object.values(presenceUnsubs).forEach(unsub => unsub?.());
        };
    }, [])

    const handleStartChat = (tutorId) => {
        setChatRecipientId(tutorId)
        setChatOpen(true)
    }

    const handleStartVideoCall = (roomUrl) => {
        setVideoCallRoom(roomUrl)
    }

    const filteredTutors = tutors.filter(tutor => {
        const matchesSearch = tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tutor.subject.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesSubject = selectedSubject === 'all' || tutor.subject === selectedSubject
        const matchesRating = selectedRating === 'all' || tutor.rating >= parseFloat(selectedRating)
        const matchesOnline = !onlineOnly || (tutor.presence && tutor.presence.online)
        return matchesSearch && matchesSubject && matchesRating && matchesOnline
    })

    // Sort: 
    // 1. Real tutors first
    // 2. Online tutors
    // 3. Others
    const sortedTutors = [...filteredTutors].sort((a, b) => {
        // Real tutors first
        if (a.isReal && !b.isReal) return -1;
        if (!a.isReal && b.isReal) return 1;

        // Then online status
        if (a.presence?.online && !b.presence?.online) return -1;
        if (!a.presence?.online && b.presence?.online) return 1;

        return 0;
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

                    <label className="online-filter">
                        <input
                            type="checkbox"
                            checked={onlineOnly}
                            onChange={(e) => setOnlineOnly(e.target.checked)}
                        />
                        <span className="online-dot online"></span>
                        Online Now
                    </label>
                </div>
            </div>

            {/* Results Count */}
            <div className="results-info">
                <span>{sortedTutors.length} tutors found</span>
                {onlineOnly && <span className="filter-tag">• Online only</span>}
            </div>

            {/* Tutors Grid */}
            <div className="tutors-grid">
                {sortedTutors.map(tutor => (
                    <div key={tutor.id} className={`tutor-card ${tutor.presence?.online ? 'is-online' : ''}`}>
                        <div className="tutor-card-header">
                            <div className="tutor-avatar-large">{tutor.avatar}</div>
                            <div className="tutor-status">
                                <OnlineIndicator
                                    online={tutor.presence?.online}
                                    lastSeen={tutor.presence?.lastSeen}
                                    size="medium"
                                    showLabel
                                />
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
                                {tutor.languages?.map(lang => (
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
                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => handleStartChat(tutor.id)}
                                >
                                    <img src="/assets/icons/chat.png" alt="Chat" width="16" height="16" style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                    Chat
                                </button>
                                {tutor.presence?.online && (
                                    <button
                                        className="btn btn-accent btn-sm"
                                        onClick={() => handleStartVideoCall(`https://guruconnect.daily.co/room-${tutor.id}`)}
                                    >
                                        📹 Call
                                    </button>
                                )}
                                <button className="btn btn-primary btn-sm">📅 Book</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {sortedTutors.length === 0 && (
                <div className="empty-state">
                    <span className="empty-icon">🔍</span>
                    <h3>No tutors found</h3>
                    <p>Try adjusting your filters or search query</p>
                </div>
            )}

            {/* Chat Panel */}
            <ChatPanel
                isOpen={chatOpen}
                onClose={() => setChatOpen(false)}
                initialRecipientId={chatRecipientId}
            />

            {/* Video Call */}
            {videoCallRoom && (
                <VideoCall
                    roomUrl={videoCallRoom}
                    participantName={user?.name || 'Student'}
                    onLeave={() => setVideoCallRoom(null)}
                />
            )}
        </div>
    )
}

export default TutorMarketplace
