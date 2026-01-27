import { useState } from 'react'
import { useToast } from '../../../App'
import './Earnings.css'

const Earnings = () => {
    const { showToast } = useToast()
    const [period, setPeriod] = useState('month')

    const stats = {
        totalEarnings: 4500,
        pendingWithdrawal: 1200,
        thisMonth: 2100,
        lastMonth: 1850,
        totalSessions: 45,
        avgPerSession: 100
    }

    const transactions = [
        { id: 1, type: 'session', student: 'Rahul Sharma', subject: 'Mathematics', amount: 10, date: 'Today, 4:00 PM' },
        { id: 2, type: 'session', student: 'Priya Patel', subject: 'Physics', amount: 15, date: 'Today, 2:00 PM' },
        { id: 3, type: 'withdrawal', method: 'Bank Transfer', amount: -500, date: 'Yesterday' },
        { id: 4, type: 'session', student: 'Amit Kumar', subject: 'Mathematics', amount: 10, date: 'Yesterday, 3:00 PM' },
        { id: 5, type: 'session', student: 'Sneha Gupta', subject: 'Chemistry', amount: 10, date: '2 days ago' },
        { id: 6, type: 'bonus', description: 'Weekly Bonus', amount: 50, date: '3 days ago' },
        { id: 7, type: 'session', student: 'Vikram Singh', subject: 'Mathematics', amount: 10, date: '3 days ago' },
    ]

    const weeklyData = [
        { day: 'Mon', sessions: 3, earnings: 30 },
        { day: 'Tue', sessions: 5, earnings: 55 },
        { day: 'Wed', sessions: 2, earnings: 20 },
        { day: 'Thu', sessions: 4, earnings: 45 },
        { day: 'Fri', sessions: 6, earnings: 65 },
        { day: 'Sat', sessions: 1, earnings: 10 },
        { day: 'Sun', sessions: 0, earnings: 0 },
    ]

    const maxEarning = Math.max(...weeklyData.map(d => d.earnings))

    const handleWithdraw = () => {
        showToast('Withdrawal request submitted! (Demo)', 'success')
    }

    return (
        <div className="earnings-page">
            <div className="page-header">
                <h1 className="page-title">Earnings</h1>
                <p className="page-subtitle">Track your income and withdrawals</p>
            </div>

            {/* Stats Overview */}
            <div className="earnings-stats">
                <div className="earnings-card main">
                    <div className="earnings-icon">💰</div>
                    <div className="earnings-info">
                        <span className="earnings-label">Total Earnings</span>
                        <span className="earnings-value">₹{stats.totalEarnings}</span>
                    </div>
                    <button className="btn btn-primary withdraw-btn" onClick={handleWithdraw}>
                        Withdraw
                    </button>
                </div>

                <div className="earnings-card">
                    <div className="earnings-icon">⏳</div>
                    <div className="earnings-info">
                        <span className="earnings-label">Pending</span>
                        <span className="earnings-value small">₹{stats.pendingWithdrawal}</span>
                    </div>
                </div>

                <div className="earnings-card">
                    <div className="earnings-icon">📅</div>
                    <div className="earnings-info">
                        <span className="earnings-label">This Month</span>
                        <span className="earnings-value small">₹{stats.thisMonth}</span>
                        <span className="earnings-trend up">+13% from last month</span>
                    </div>
                </div>

                <div className="earnings-card">
                    <div className="earnings-icon">📚</div>
                    <div className="earnings-info">
                        <span className="earnings-label">Sessions</span>
                        <span className="earnings-value small">{stats.totalSessions}</span>
                    </div>
                </div>
            </div>

            {/* Weekly Chart */}
            <div className="chart-section">
                <div className="chart-header">
                    <h3>Weekly Overview</h3>
                    <div className="period-toggle">
                        <button className={`period-btn ${period === 'week' ? 'active' : ''}`} onClick={() => setPeriod('week')}>Week</button>
                        <button className={`period-btn ${period === 'month' ? 'active' : ''}`} onClick={() => setPeriod('month')}>Month</button>
                    </div>
                </div>
                <div className="bar-chart">
                    {weeklyData.map((data, i) => (
                        <div key={i} className="bar-group">
                            <div className="bar-container">
                                <div
                                    className="bar"
                                    style={{ height: `${(data.earnings / maxEarning) * 100}%` }}
                                >
                                    <span className="bar-value">₹{data.earnings}</span>
                                </div>
                            </div>
                            <span className="bar-label">{data.day}</span>
                            <span className="bar-sessions">{data.sessions} sessions</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Transactions */}
            <div className="transactions-section">
                <div className="section-header">
                    <h3>Recent Transactions</h3>
                    <button className="btn btn-ghost btn-sm">View All</button>
                </div>
                <div className="transactions-list">
                    {transactions.map(tx => (
                        <div key={tx.id} className="transaction-item">
                            <div className={`tx-icon ${tx.type}`}>
                                {tx.type === 'session' && '📚'}
                                {tx.type === 'withdrawal' && '💳'}
                                {tx.type === 'bonus' && '🎁'}
                            </div>
                            <div className="tx-info">
                                {tx.type === 'session' && (
                                    <>
                                        <span className="tx-title">Session with {tx.student}</span>
                                        <span className="tx-subtitle">{tx.subject}</span>
                                    </>
                                )}
                                {tx.type === 'withdrawal' && (
                                    <>
                                        <span className="tx-title">Withdrawal</span>
                                        <span className="tx-subtitle">{tx.method}</span>
                                    </>
                                )}
                                {tx.type === 'bonus' && (
                                    <>
                                        <span className="tx-title">{tx.description}</span>
                                        <span className="tx-subtitle">Reward</span>
                                    </>
                                )}
                            </div>
                            <div className="tx-date">{tx.date}</div>
                            <div className={`tx-amount ${tx.amount > 0 ? 'positive' : 'negative'}`}>
                                {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Payment Methods */}
            <div className="payment-section">
                <div className="section-header">
                    <h3>Payment Methods</h3>
                    <button className="btn btn-secondary btn-sm">+ Add New</button>
                </div>
                <div className="payment-methods">
                    <div className="payment-card active">
                        <div className="payment-icon">🏦</div>
                        <div className="payment-info">
                            <span className="payment-name">HDFC Bank</span>
                            <span className="payment-number">**** **** **** 4521</span>
                        </div>
                        <span className="payment-default">Default</span>
                    </div>
                    <div className="payment-card">
                        <div className="payment-icon">📱</div>
                        <div className="payment-info">
                            <span className="payment-name">UPI</span>
                            <span className="payment-number">tutor@upi</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Earnings
