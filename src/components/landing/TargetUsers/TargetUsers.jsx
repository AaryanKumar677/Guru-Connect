import { useState } from 'react'
import { useAuth } from '../../../App'
import './TargetUsers.css'

const TargetUsers = () => {
    const { openAuthModal } = useAuth()


    const studentFeatures = [
        {
            icon: '💬',
            iconBg: 'gradient-blue',
            title: 'Live Chat with Teachers',
            description: 'Connect instantly with expert tutors through real-time messaging for quick doubt resolution.'
        },
        {
            icon: '📹',
            iconBg: 'gradient-pink',
            title: 'Audio & Video Calls',
            description: 'Face-to-face learning sessions with HD quality audio and video calls.'
        },
        {
            icon: '🤖',
            iconBg: 'gradient-purple',
            title: 'AI Doubt Assistant',
            description: 'Get instant answers powered by advanced AI, available 24/7 for your queries.'
        },
        {
            icon: '🎯',
            iconBg: 'gradient-green',
            title: 'Personalized Learning Path',
            description: 'AI-curated learning paths based on your strengths, weaknesses, and goals.'
        },
        {
            icon: '🎁',
            iconBg: 'gradient-orange',
            title: 'Points-Based Free Access',
            description: 'Earn points through daily activities and use them for free tutoring sessions.'
        },
        {
            icon: '📊',
            iconBg: 'gradient-cyan',
            title: 'Progress Tracking',
            description: 'Track your learning journey with detailed analytics and performance insights.'
        }
    ]

    const tutorFeatures = [
        {
            icon: '📋',
            iconBg: 'gradient-blue',
            title: 'Student Management Dashboard',
            description: 'Organize students, track progress, and manage sessions efficiently.'
        },
        {
            icon: '💰',
            iconBg: 'gradient-orange',
            title: 'Earnings & Subscription',
            description: 'Flexible earning models with transparent payout systems.'
        },
        {
            icon: '🖥️',
            iconBg: 'gradient-purple',
            title: 'Live Teaching Tools',
            description: 'Whiteboard, screen sharing, and interactive tools for effective teaching.'
        },
        {
            icon: '⭐',
            iconBg: 'gradient-pink',
            title: 'Profile & Expertise Showcase',
            description: 'Build your professional profile and attract more students.'
        },
        {
            icon: '📅',
            iconBg: 'gradient-green',
            title: 'Session Scheduling',
            description: 'Easy-to-use calendar for managing your availability and bookings.'
        },
        {
            icon: '🏆',
            iconBg: 'gradient-cyan',
            title: 'Feedback & Ratings',
            description: 'Build reputation through student reviews and performance metrics.'
        }
    ]



    return (
        <section id="users" className="target-users section">
            {/* Background */}
            <div className="target-users-bg">
                <div className="users-blob-1"></div>
                <div className="users-blob-2"></div>
                <div className="users-particles">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="particle" style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`
                        }}></div>
                    ))}
                </div>
            </div>

            <div className="container">
                {/* Section Header */}
                <div className="section-header">
                    <span className="section-label">For Everyone</span>
                    <h2 className="section-title">
                        Built for <span className="text-gradient">You</span>
                    </h2>
                    <p className="section-subtitle">
                        Whether you're a student seeking knowledge or a teacher sharing wisdom,
                        Guru Connect has something special for you.
                    </p>
                </div>

                {/* Split Layout */}
                <div className="users-split-layout">
                    {/* Students Column */}
                    <div className="users-column">
                        <div className="column-header-card">
                            <span className="header-icon">🎓</span>
                            <h3>For Students</h3>
                        </div>
                        <div className="users-list">
                            {studentFeatures.map((feature, index) => (
                                <div
                                    key={`student-${index}`}
                                    className="user-feature-card"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className={`feature-icon-wrapper ${feature.iconBg}`}>
                                        <span className="feature-icon">{feature.icon}</span>
                                    </div>
                                    <div className="feature-content">
                                        <h3 className="feature-title">{feature.title}</h3>
                                        <p className="feature-description">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tutors Column */}
                    <div className="users-column">
                        <div className="column-header-card">
                            <span className="header-icon">👨‍🏫</span>
                            <h3>For Tutors</h3>
                        </div>
                        <div className="users-list">
                            {tutorFeatures.map((feature, index) => (
                                <div
                                    key={`tutor-${index}`}
                                    className="user-feature-card"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className={`feature-icon-wrapper ${feature.iconBg}`}>
                                        <span className="feature-icon">{feature.icon}</span>
                                    </div>
                                    <div className="feature-content">
                                        <h3 className="feature-title">{feature.title}</h3>
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

export default TargetUsers
