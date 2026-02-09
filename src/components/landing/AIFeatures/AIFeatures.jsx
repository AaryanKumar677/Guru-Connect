import './AIFeatures.css'

const AIFeatures = () => {
    const features = [
        {
            icon: '⚡',
            title: 'Instant Doubt Solving',
            description: 'Get immediate answers to your questions with our AI that understands context and provides detailed explanations.'
        },
        {
            icon: '💡',
            title: 'Smart Suggestions',
            description: 'Receive personalized study suggestions based on your learning patterns and weak areas.'
        },
        {
            icon: '📈',
            title: 'Topic Recommendations',
            description: 'AI-powered recommendations for topics you should focus on based on your performance.'
        },
        {
            icon: '📊',
            title: 'Learning Analytics',
            description: 'Detailed insights into your learning progress, time spent, and improvement areas.'
        }
    ]

    return (
        <section className="ai-features section">
            {/* Background */}
            <div className="ai-features-bg">
                <div className="ai-grid"></div>
                <div className="ai-glow-1"></div>
                <div className="ai-glow-2"></div>
            </div>

            <div className="container">
                <div className="ai-features-content">
                    {/* Left Content */}
                    <div className="ai-features-info">
                        <span className="section-label">AI Powered</span>
                        <h2 className="section-title">
                            Experience the Future of<br /><span className="text-gradient">Learning</span>
                        </h2>
                        <p className="ai-features-description">
                            Our advanced AI assistant is available 24/7 to help you understand complex
                            concepts, solve problems, and accelerate your learning journey.
                        </p>

                        <div className="ai-features-list">
                            {features.map((feature, index) => (
                                <div key={index} className="ai-feature-item">
                                    <div className="ai-feature-icon">{feature.icon}</div>
                                    <div className="ai-feature-content">
                                        <h4 className="ai-feature-title">{feature.title}</h4>
                                        <p className="ai-feature-description">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Visual */}
                    <div className="ai-features-visual">
                        <div className="ai-chat-demo">
                            <div className="ai-chat-header">
                                <div className="ai-avatar">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                                    </svg>
                                </div>
                                <div className="ai-chat-title">
                                    <span className="ai-name">Guru AI</span>
                                    <span className="ai-status">Always Online</span>
                                </div>
                                <div className="ai-badge">Beta</div>
                            </div>

                            <div className="ai-chat-messages">
                                <div className="ai-message user">
                                    <p>Can you explain the Pythagorean theorem?</p>
                                </div>
                                <div className="ai-message bot">
                                    <p>The Pythagorean theorem states that in a right triangle:</p>
                                    <div className="ai-formula">a² + b² = c²</div>
                                    <p>Where c is the hypotenuse and a, b are the other two sides.</p>
                                </div>
                                <div className="ai-message user">
                                    <p>Can you give me an example?</p>
                                </div>
                                <div className="ai-message bot typing">
                                    <div className="typing-dots">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>

                            <div className="ai-chat-input">
                                <input type="text" placeholder="Ask anything..." disabled />
                                <button className="ai-send-btn" disabled>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="22" y1="2" x2="11" y2="13"></line>
                                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Floating Stats */}
                        <div className="ai-stat ai-stat-1">
                            <span className="ai-stat-icon">🎯</span>
                            <div className="ai-stat-content">
                                <span className="ai-stat-value">98%</span>
                                <span className="ai-stat-label">Accuracy</span>
                            </div>
                        </div>
                        <div className="ai-stat ai-stat-2">
                            <span className="ai-stat-icon">⚡</span>
                            <div className="ai-stat-content">
                                <span className="ai-stat-value">&lt;2s</span>
                                <span className="ai-stat-label">Response</span>
                            </div>
                        </div>
                        <div className="ai-stat ai-stat-3">
                            <span className="ai-stat-icon">🌐</span>
                            <div className="ai-stat-content">
                                <span className="ai-stat-value">24/7</span>
                                <span className="ai-stat-label">Available</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AIFeatures
