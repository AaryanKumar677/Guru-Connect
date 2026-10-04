/* ==============================
   Comparison Component - Why Choose Us Section
   Side-by-side comparison of GuruConnect vs traditional learning,
   highlighting advantages with checkmark/cross indicators
   ============================== */
import { useAuth } from '../../../App'
import './Comparison.css'

const Comparison = () => {
    const { openAuthModal } = useAuth()

    const comparisons = [
        {
            normal: 'Only recorded videos',
            guru: 'Live teacher interaction',
            normalIcon: '📼',
            guruIcon: '🎥'
        },
        {
            normal: 'No personalization',
            guru: 'AI + Real Teachers',
            normalIcon: '📋',
            guruIcon: '🤖'
        },
        {
            normal: 'Paid only access',
            guru: 'Free + Points System',
            normalIcon: '💸',
            guruIcon: '🎁'
        },
        {
            normal: 'One-way learning',
            guru: 'Two-way communication',
            normalIcon: '📺',
            guruIcon: '💬'
        },
        {
            normal: 'Fixed schedules',
            guru: 'Flexible timing',
            normalIcon: '⏰',
            guruIcon: '📅'
        },
        {
            normal: 'Generic content',
            guru: 'Personalized path',
            normalIcon: '📚',
            guruIcon: '🎯'
        }
    ]

    return (
        <section id="why-us" className="comparison section">
            {/* Background Effects */}
            <div className="comparison-bg">
                <div className="comparison-glow-1"></div>
                <div className="comparison-glow-2"></div>
                <div className="comparison-grid-pattern"></div>
            </div>

            <div className="container">
                {/* Section Header */}
                <div className="section-header">
                    <span className="section-label">Why Choose Us</span>
                    <h2 className="section-title">
                        See the <span className="text-gradient">Difference</span>
                    </h2>
                    <p className="section-subtitle">
                        Discover why thousands of students and tutors choose Guru Connect
                        over traditional learning platforms.
                    </p>
                </div>

                {/* New Two Column Layout */}
                <div className="comparison-container">
                    {/* Normal Apps Column */}
                    <div className="comparison-column normal">
                        <div className="column-header">
                            <div className="column-badge negative">
                                <span>❌</span>
                            </div>
                            <h3>Normal Apps</h3>
                            <p>Traditional platforms fall short</p>
                        </div>
                        <div className="column-items">
                            {comparisons.map((item, index) => (
                                <div key={index} className="column-item" style={{ animationDelay: `${index * 0.1}s` }}>
                                    <span className="column-item-icon">{item.normalIcon}</span>
                                    <span className="column-item-text">{item.normal}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* VS Badge */}
                    <div className="vs-badge">
                        <div className="vs-inner">
                            <span>VS</span>
                        </div>
                    </div>

                    {/* Guru Connect Column */}
                    <div className="comparison-column guru">
                        <div className="column-header">
                            <div className="column-badge positive">
                                <span>✨</span>
                            </div>
                            <h3>Guru Connect</h3>
                            <p>The smarter way to learn</p>
                        </div>
                        <div className="column-items">
                            {comparisons.map((item, index) => (
                                <div key={index} className="column-item" style={{ animationDelay: `${index * 0.1}s` }}>
                                    <span className="column-item-icon">{item.guruIcon}</span>
                                    <span className="column-item-text">{item.guru}</span>
                                    <span className="check-icon">✓</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>


            </div>
        </section>
    )
}

export default Comparison
