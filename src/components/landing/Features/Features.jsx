import './Features.css'

const Features = () => {
    const studentFeatures = [
        {
            icon: '💬',
            title: 'Live Chat with Teachers',
            description: 'Connect instantly with expert tutors through real-time messaging for quick doubt resolution.'
        },
        {
            icon: '📞',
            title: 'Audio & Video Calls',
            description: 'Face-to-face learning sessions with HD quality audio and video calls.'
        },
        {
            icon: '🤖',
            title: 'AI Doubt Assistant',
            description: 'Get instant answers powered by advanced AI, available 24/7 for your queries.'
        },
        {
            icon: '🎯',
            title: 'Personalized Learning Path',
            description: 'AI-curated learning paths based on your strengths, weaknesses, and goals.'
        },
        {
            icon: '🎁',
            title: 'Points-Based Free Access',
            description: 'Earn points through daily activities and use them for free tutoring sessions.'
        },
        {
            icon: '📚',
            title: 'Subject-wise Tutors',
            description: 'Find specialized tutors for every subject from Math to Languages.'
        },
        {
            icon: '🔔',
            title: 'Smart Notifications',
            description: 'Never miss a session with intelligent reminders and updates.'
        }
    ]

    const tutorFeatures = [
        {
            icon: '📊',
            title: 'Student Management Dashboard',
            description: 'Organize students, track progress, and manage sessions efficiently.'
        },
        {
            icon: '💰',
            title: 'Earnings & Subscription',
            description: 'Flexible earning models with transparent payout systems.'
        },
        {
            icon: '🎥',
            title: 'Live Teaching Tools',
            description: 'Whiteboard, screen sharing, and interactive tools for effective teaching.'
        },
        {
            icon: '👤',
            title: 'Profile & Expertise Showcase',
            description: 'Build your professional profile and attract more students.'
        },
        {
            icon: '📅',
            title: 'Session Scheduling',
            description: 'Easy-to-use calendar for managing your availability and bookings.'
        },
        {
            icon: '⭐',
            title: 'Feedback & Ratings',
            description: 'Build reputation through student reviews and ratings.'
        }
    ]

    return (
        <section id="features" className="features section">
            {/* Background Elements */}
            <div className="features-bg">
                <div className="features-gradient"></div>
            </div>

            <div className="container">
                {/* Section Header */}
                <div className="section-header">
                    <span className="section-label">Features</span>
                    <h2 className="section-title">
                        Everything You Need to <span className="text-gradient">Succeed</span>
                    </h2>
                    <p className="section-subtitle">
                        Powerful features designed for both students and tutors to make learning
                        and teaching more effective, engaging, and rewarding.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="features-content">
                    {/* For Students */}
                    <div className="features-column">
                        <div className="column-header">
                            <span className="column-icon">🎓</span>
                            <h3 className="column-title">For Students</h3>
                        </div>
                        <div className="features-grid">
                            {studentFeatures.map((feature, index) => (
                                <div
                                    key={index}
                                    className="feature-card"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="feature-icon">{feature.icon}</div>
                                    <div className="feature-content">
                                        <h4 className="feature-title">{feature.title}</h4>
                                        <p className="feature-description">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* For Tutors */}
                    <div className="features-column">
                        <div className="column-header">
                            <span className="column-icon">👨‍🏫</span>
                            <h3 className="column-title">For Tutors</h3>
                        </div>
                        <div className="features-grid">
                            {tutorFeatures.map((feature, index) => (
                                <div
                                    key={index}
                                    className="feature-card"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="feature-icon">{feature.icon}</div>
                                    <div className="feature-content">
                                        <h4 className="feature-title">{feature.title}</h4>
                                        <p className="feature-description">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Features
