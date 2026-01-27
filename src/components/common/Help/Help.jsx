import { useState } from 'react'
import './Help.css'

const Help = () => {
    const [activeCategory, setActiveCategory] = useState('general')
    const [searchQuery, setSearchQuery] = useState('')

    const categories = [
        { id: 'general', label: 'General', icon: '📋' },
        { id: 'account', label: 'Account', icon: '👤' },
        { id: 'tutors', label: 'Tutors', icon: '👨‍🏫' },
        { id: 'ai', label: 'AI Assistant', icon: '🤖' },
        { id: 'payments', label: 'Payments', icon: '💳' },
    ]

    const faqs = {
        general: [
            {
                q: 'What is Guru Connect?',
                a: 'Guru Connect is an ed-tech platform that connects students with expert tutors and provides AI-powered learning assistance. You can get your doubts solved instantly via AI or book sessions with real tutors.'
            },
            {
                q: 'How do I get started?',
                a: 'Simply create an account, choose whether you\'re a student or tutor, and start exploring! Students can ask doubts to AI or find tutors, while tutors can set up their profile and start accepting students.'
            },
            {
                q: 'Is Guru Connect free to use?',
                a: 'We offer a free tier with limited AI queries per day. For unlimited access and tutor sessions, you can upgrade to our premium plans starting at ₹199/month.'
            },
        ],
        account: [
            {
                q: 'How do I reset my password?',
                a: 'Click on "Forgot Password" on the login screen, enter your email, and we\'ll send you an OTP to reset your password.'
            },
            {
                q: 'How do I change my profile information?',
                a: 'Go to your Profile page from the sidebar and click "Edit Profile" to update your information.'
            },
            {
                q: 'How do I delete my account?',
                a: 'Go to Settings > Danger Zone > Delete Account. Note that this action is irreversible and all your data will be permanently deleted.'
            },
        ],
        tutors: [
            {
                q: 'How do I find a tutor?',
                a: 'Go to "Find Tutors" from your dashboard. You can search by subject, filter by rating and price, and view tutor profiles before booking.'
            },
            {
                q: 'How do I book a session?',
                a: 'Click on "Book" button on any tutor\'s card, select your preferred time slot, and confirm the booking. Points will be deducted from your balance.'
            },
            {
                q: 'Can I cancel a session?',
                a: 'Yes, you can cancel up to 2 hours before the scheduled time for a full refund. Cancellations within 2 hours will receive a 50% refund.'
            },
        ],
        ai: [
            {
                q: 'How many AI queries do I get?',
                a: 'Free users get 10 AI queries per day. Premium users get unlimited queries. Your query count resets at midnight.'
            },
            {
                q: 'What subjects can AI help with?',
                a: 'Our AI can help with all academic subjects including Math, Science, English, History, and more. It can explain concepts, solve problems, and answer questions.'
            },
            {
                q: 'Can I ask follow-up questions?',
                a: 'Yes! The AI remembers your conversation context, so you can ask follow-up questions for deeper understanding.'
            },
        ],
        payments: [
            {
                q: 'What payment methods are accepted?',
                a: 'We accept all major credit/debit cards, UPI, net banking, and popular wallets like Paytm and PhonePe.'
            },
            {
                q: 'How do I earn points?',
                a: 'You can earn points by: daily login (+10), completing sessions (+50), referring friends (+100), and maintaining streaks.'
            },
            {
                q: 'How do tutors get paid?',
                a: 'Tutors can withdraw their earnings weekly via bank transfer or UPI. A 10% platform fee is deducted from each session.'
            },
        ],
    }

    const filteredFaqs = searchQuery
        ? Object.values(faqs).flat().filter(faq =>
            faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : faqs[activeCategory]

    return (
        <div className="help-page">
            <div className="page-header">
                <h1 className="page-title">Help & FAQ</h1>
                <p className="page-subtitle">Find answers to common questions</p>
            </div>

            {/* Search */}
            <div className="help-search">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    placeholder="Search for help..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="help-content">
                {/* Categories */}
                {!searchQuery && (
                    <div className="help-categories">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat.id)}
                            >
                                <span>{cat.icon}</span>
                                <span>{cat.label}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* FAQs */}
                <div className="faq-list">
                    {filteredFaqs.map((faq, index) => (
                        <FaqItem key={index} question={faq.q} answer={faq.a} />
                    ))}
                    {filteredFaqs.length === 0 && (
                        <div className="no-results">
                            <span>🔍</span>
                            <p>No results found for "{searchQuery}"</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Contact Support */}
            <div className="contact-support">
                <h3>Still need help?</h3>
                <p>Our support team is available 24/7</p>
                <div className="contact-options">
                    <button className="contact-btn">
                        <span>📧</span>
                        Email Support
                    </button>
                    <button className="contact-btn">
                        <span>💬</span>
                        Live Chat
                    </button>
                </div>
            </div>
        </div>
    )
}

const FaqItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className={`faq-item ${isOpen ? 'open' : ''}`}>
            <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
                <span>{question}</span>
                <span className="faq-icon">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
                <div className="faq-answer">
                    <p>{answer}</p>
                </div>
            )}
        </div>
    )
}

export default Help
