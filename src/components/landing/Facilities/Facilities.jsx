import './Facilities.css'

const Facilities = () => {
    const facilities = [
        {
            icon: '📚',
            title: 'Multi-Subject Learning',
            description: 'Access expert tutors across all subjects from Mathematics to Languages.',
            color: 'blue',
            size: 'normal'
        },
        {
            icon: '💬',
            title: 'Real-time Messaging',
            description: 'Instant chat with tutors and AI for quick doubt resolution anytime.',
            color: 'green',
            size: 'normal'
        },
        {
            icon: '📞',
            title: 'HD Audio/Video Calls',
            description: 'Crystal clear video sessions for immersive face-to-face learning experience.',
            color: 'purple',
            size: 'large'
        },
        {
            icon: '🤖',
            title: 'AI Assistant',
            description: '24/7 AI-powered help for instant answers.',
            color: 'cyan',
            size: 'normal'
        },
        {
            icon: '💳',
            title: 'Points & Subscription',
            description: 'Flexible payment with free points access.',
            color: 'orange',
            size: 'normal'
        },
        {
            icon: '📊',
            title: 'Progress Tracking',
            description: 'Monitor your learning journey with detailed analytics and performance insights.',
            color: 'pink',
            size: 'large'
        },
        {
            icon: '🛡️',
            title: 'Secure Platform',
            description: 'Enterprise-grade security for your data.',
            color: 'yellow',
            size: 'normal'
        },
        {
            icon: '🌐',
            title: 'Multi-Device Support',
            description: 'Learn on desktop, tablet, and mobile.',
            color: 'teal',
            size: 'normal'
        }
    ]

    return (
        <section id="facilities" className="facilities section">
            {/* Background */}
            <div className="facilities-bg">
                <div className="facilities-orb facilities-orb-1"></div>
                <div className="facilities-orb facilities-orb-2"></div>
                <div className="facilities-orb facilities-orb-3"></div>
                <div className="facilities-grid-lines"></div>
            </div>

            <div className="container">
                {/* Section Header */}
                <div className="section-header">
                    <span className="section-label">🛠️ Facilities</span>
                    <h2 className="section-title">
                        Everything in <span className="text-gradient">One Place</span>
                    </h2>
                    <p className="section-subtitle">
                        A complete learning ecosystem with all the tools and features you need
                        to succeed in your educational journey.
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="facilities-bento">
                    {facilities.map((facility, index) => (
                        <div
                            key={index}
                            className={`facility-card facility-${facility.color} facility-size-${facility.size}`}
                            style={{ animationDelay: `${index * 0.08}s` }}
                        >
                            <div className="facility-card-inner">
                                <div className={`facility-icon-box gradient-${facility.color}`}>
                                    <span className="facility-icon">{facility.icon}</span>
                                </div>
                                <div className="facility-content">
                                    <h3 className="facility-title">{facility.title}</h3>
                                    <p className="facility-description">{facility.description}</p>
                                </div>
                            </div>
                            <div className="facility-border-glow"></div>
                        </div>
                    ))}
                </div>

                {/* Bottom Feature Bar */}
                <div className="facilities-feature-bar">
                    <div className="feature-bar-item">
                        <span className="bar-icon">⚡</span>
                        <span className="bar-text">Instant Setup</span>
                    </div>
                    <div className="feature-bar-divider"></div>
                    <div className="feature-bar-item">
                        <span className="bar-icon">🔒</span>
                        <span className="bar-text">100% Secure</span>
                    </div>
                    <div className="feature-bar-divider"></div>
                    <div className="feature-bar-item">
                        <span className="bar-icon">💯</span>
                        <span className="bar-text">Free to Start</span>
                    </div>
                    <div className="feature-bar-divider"></div>
                    <div className="feature-bar-item">
                        <span className="bar-icon">🌍</span>
                        <span className="bar-text">Global Access</span>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Facilities
