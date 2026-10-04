/* ==============================
   Subscription Component - Pricing Plans
   Displays subscription tiers (Free, Pro, Premium) with feature lists,
   pricing, plan comparison, current plan indicator, and upgrade buttons
   ============================== */
import { useState } from 'react'
import { useToast } from '../../../App'
import './Subscription.css'

const Subscription = () => {
    const { showToast } = useToast()
    const [currentPlan, setCurrentPlan] = useState('free')

    const stats = {
        currentPoints: 250,
        earnedThisMonth: 180,
        spent: 50,
        freeQueriesLeft: 7
    }

    const plans = [
        {
            id: 'free',
            name: 'Free',
            price: 0,
            features: [
                '200 points/month',
                '10 AI queries/day',
                'Basic tutor access',
                'Community support'
            ],
            popular: false
        },
        {
            id: 'basic',
            name: 'Basic',
            price: 99,
            features: [
                '500 points/month',
                '50 AI queries/day',
                'Priority tutor matching',
                'Email support',
                'Session recordings'
            ],
            popular: false
        },
        {
            id: 'pro',
            name: 'Pro',
            price: 199,
            features: [
                '1000 points/month',
                'Unlimited AI queries',
                'Instant tutor matching',
                'Priority support',
                'Session recordings',
                'Progress analytics'
            ],
            popular: true
        },
        {
            id: 'unlimited',
            name: 'Unlimited',
            price: 499,
            features: [
                'Unlimited points',
                'Unlimited AI queries',
                'VIP tutor access',
                '24/7 priority support',
                'All features included',
                'Personal learning advisor'
            ],
            popular: false
        }
    ]

    const earningMethods = [
        { icon: '📅', title: 'Daily Login', points: '+15', description: 'Log in every day' },
        { icon: '✅', title: 'Complete Profile', points: '+30', description: 'Fill all profile fields' },
        { icon: '👥', title: 'Refer a Friend', points: '+100', description: 'Per successful referral' },
        { icon: '⭐', title: 'Rate a Session', points: '+5', description: 'After each session' },
        { icon: '📝', title: 'Complete Quiz', points: '+10', description: 'Weekly practice quizzes' },
    ]

    const transactions = [
        { id: 1, type: 'earned', description: 'Daily login bonus', points: 15, date: 'Today' },
        { id: 2, type: 'spent', description: 'Tutor session - Math', points: -10, date: 'Yesterday' },
        { id: 3, type: 'earned', description: 'Profile completion', points: 30, date: '2 days ago' },
        { id: 4, type: 'spent', description: 'AI queries (5)', points: -5, date: '3 days ago' },
        { id: 5, type: 'earned', description: 'Referral bonus', points: 100, date: '1 week ago' },
    ]

    const handleUpgrade = (planId) => {
        showToast(`Upgrading to ${planId} plan... (Demo)`, 'info')
    }

    return (
        <div className="subscription-page">
            <div className="page-header">
                <h1 className="page-title">Points & Subscription</h1>
                <p className="page-subtitle">Manage your points and upgrade your plan</p>
            </div>

            {/* Points Overview */}
            <div className="points-overview">
                <div className="points-card main">
                    <div className="points-icon">🎯</div>
                    <div className="points-info">
                        <span className="points-label">Current Balance</span>
                        <span className="points-value">{stats.currentPoints}</span>
                        <span className="points-unit">points</span>
                    </div>
                </div>

                <div className="points-card">
                    <div className="points-icon">📈</div>
                    <div className="points-info">
                        <span className="points-label">Earned This Month</span>
                        <span className="points-value earned">+{stats.earnedThisMonth}</span>
                    </div>
                </div>

                <div className="points-card">
                    <div className="points-icon">💸</div>
                    <div className="points-info">
                        <span className="points-label">Spent This Month</span>
                        <span className="points-value spent">-{stats.spent}</span>
                    </div>
                </div>

                <div className="points-card">
                    <div className="points-icon">🤖</div>
                    <div className="points-info">
                        <span className="points-label">AI Queries Left Today</span>
                        <span className="points-value">{stats.freeQueriesLeft}</span>
                    </div>
                </div>
            </div>

            {/* Subscription Plans */}
            <section className="plans-section">
                <h2 className="section-title">Subscription Plans</h2>
                <div className="plans-grid">
                    {plans.map(plan => (
                        <div key={plan.id} className={`plan-card ${plan.popular ? 'popular' : ''} ${currentPlan === plan.id ? 'current' : ''}`}>
                            {plan.popular && <span className="popular-badge">Most Popular</span>}
                            {currentPlan === plan.id && <span className="current-badge">Current Plan</span>}

                            <h3 className="plan-name">{plan.name}</h3>
                            <div className="plan-price">
                                <span className="price-amount">₹{plan.price}</span>
                                {plan.price > 0 && <span className="price-period">/month</span>}
                            </div>

                            <ul className="plan-features">
                                {plan.features.map((feature, i) => (
                                    <li key={i}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="20,6 9,17 4,12" />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={`btn ${currentPlan === plan.id ? 'btn-secondary' : plan.popular ? 'btn-primary' : 'btn-secondary'} plan-btn`}
                                onClick={() => handleUpgrade(plan.id)}
                                disabled={currentPlan === plan.id}
                            >
                                {currentPlan === plan.id ? 'Current Plan' : plan.price === 0 ? 'Downgrade' : 'Upgrade'}
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Earn Points */}
            <section className="earn-section">
                <h2 className="section-title">Earn More Points</h2>
                <div className="earn-grid">
                    {earningMethods.map((method, i) => (
                        <div key={i} className="earn-card">
                            <span className="earn-icon">{method.icon}</span>
                            <div className="earn-info">
                                <span className="earn-title">{method.title}</span>
                                <span className="earn-desc">{method.description}</span>
                            </div>
                            <span className="earn-points">{method.points}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Transaction History */}
            <section className="transactions-section">
                <h2 className="section-title">Recent Transactions</h2>
                <div className="transactions-list">
                    {transactions.map(tx => (
                        <div key={tx.id} className="transaction-item">
                            <div className={`tx-icon ${tx.type}`}>
                                {tx.type === 'earned' ? '↗' : '↘'}
                            </div>
                            <div className="tx-info">
                                <span className="tx-desc">{tx.description}</span>
                                <span className="tx-date">{tx.date}</span>
                            </div>
                            <span className={`tx-points ${tx.type}`}>
                                {tx.points > 0 ? '+' : ''}{tx.points}
                            </span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default Subscription
