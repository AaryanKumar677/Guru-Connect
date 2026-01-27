import { useAuth } from '../../../App'
import './Hero.css'

const Hero = () => {
    const { openAuthModal } = useAuth()

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <section className="hero">
            {/* Background Effects */}
            <div className="hero-bg">
                <div className="hero-gradient-1"></div>
                <div className="hero-gradient-2"></div>
                <div className="hero-grid"></div>

                {/* Floating Elements */}
                <div className="floating-elements">
                    <div className="floating-element floating-book animate-float stagger-1">📚</div>
                    <div className="floating-element floating-brain animate-float stagger-2">🧠</div>
                    <div className="floating-element floating-rocket animate-float stagger-3">🚀</div>
                    <div className="floating-element floating-star animate-float stagger-4">⭐</div>
                    <div className="floating-element floating-bulb animate-float stagger-5">💡</div>
                    <div className="floating-element floating-graduation animate-float stagger-6">🎓</div>
                </div>
            </div>

            <div className="container hero-container">
                <div className="hero-content animate-fade-in-up">
                    {/* Badge */}
                    <div className="hero-badge">
                        <span className="badge-dot"></span>
                        <span>Powered by AI & Expert Tutors</span>
                    </div>

                    {/* Heading */}
                    <h1 className="hero-title text-vibrant">
                        Learn Smarter
                        <br />
                        with AI and Real Teachers
                    </h1>

                    {/* Subtitle */}
                    <p className="hero-subtitle">
                        Connect with expert tutors, get instant AI-powered help, and unlock your
                        full learning potential. The future of education is here.
                    </p>

                    {/* CTA Buttons */}
                    <div className="hero-actions">
                        <button
                            onClick={() => openAuthModal('signup')}
                            className="btn btn-primary btn-lg hero-btn"
                        >
                            ✨ Get Started Free
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </button>
                        <button
                            onClick={() => scrollToSection('features')}
                            className="btn btn-secondary btn-lg hero-btn"
                        >
                            Explore Features
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="hero-stats">
                        <div className="stat-item">
                            <span className="stat-number">10K+</span>
                            <span className="stat-label">Active Students</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-number">500+</span>
                            <span className="stat-label">Expert Tutors</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-number">50K+</span>
                            <span className="stat-label">Doubts Solved</span>
                        </div>
                    </div>
                </div>

                {/* Hero Visual */}
                <div className="hero-visual animate-fade-in stagger-2">
                    <div className="hero-card-main">
                        <div className="card-glow"></div>
                        <div className="hero-card-content">
                            {/* Chat Preview */}
                            <div className="chat-preview">
                                <div className="chat-header">
                                    <div className="chat-avatar ai">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                        </svg>
                                    </div>
                                    <span className="chat-name">AI Assistant</span>
                                    <span className="chat-badge">Online</span>
                                </div>
                                <div className="chat-messages">
                                    <div className="chat-message user">
                                        <p>How do I solve quadratic equations?</p>
                                    </div>
                                    <div className="chat-message ai">
                                        <p>Great question! Let me explain step by step...</p>
                                        <div className="typing-indicator">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tutor Card Preview */}
                            <div className="tutor-card-preview">
                                <div className="tutor-avatar">
                                    <span>👨‍🏫</span>
                                </div>
                                <div className="tutor-info">
                                    <span className="tutor-name">Prof. Sharma</span>
                                    <span className="tutor-subject">Mathematics</span>
                                </div>
                                <div className="tutor-rating">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                    <span>4.9</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Mini Cards */}
                    <div className="mini-card mini-card-1 animate-float stagger-3">
                        <span className="mini-icon">🎯</span>
                        <span className="mini-text">+50 Points</span>
                    </div>
                    <div className="mini-card mini-card-2 animate-float stagger-4">
                        <span className="mini-icon">✅</span>
                        <span className="mini-text">Doubt Solved!</span>
                    </div>
                    <div className="mini-card mini-card-3 animate-float stagger-5">
                        <span className="mini-icon">📞</span>
                        <span className="mini-text">Call Started</span>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="scroll-indicator">
                <div className="scroll-mouse">
                    <div className="scroll-wheel"></div>
                </div>
                <span>Scroll to explore</span>
            </div>
        </section>
    )
}

export default Hero
