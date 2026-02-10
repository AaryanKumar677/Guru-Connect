import { useState } from 'react'
import './MyDoubts.css'

const MyDoubts = () => {
    const [filter, setFilter] = useState('all')
    const [selectedDoubt, setSelectedDoubt] = useState(null)

    const doubts = [
        {
            id: 1,
            title: 'How to solve differential equations?',
            subject: 'Mathematics',
            status: 'resolved',
            type: 'tutor',
            createdAt: '2 hours ago',
            messages: [
                { id: 1, sender: 'user', content: 'I\'m having trouble understanding differential equations. Can you help?', time: '2:00 PM' },
                { id: 2, sender: 'tutor', content: 'Of course! Differential equations are equations that involve derivatives. Let me explain step by step...', time: '2:05 PM' },
                { id: 3, sender: 'user', content: 'That makes sense! Can you give an example?', time: '2:10 PM' },
                { id: 4, sender: 'tutor', content: 'Sure! Consider dy/dx = 2x. To solve this, we integrate both sides...', time: '2:15 PM' },
            ],
            tutor: { name: 'Dr. Arnav Singh', avatar: '👨‍🏫' }
        },
        {
            id: 2,
            title: 'Explain Newton\'s laws of motion',
            subject: 'Physics',
            status: 'pending',
            type: 'tutor',
            createdAt: '5 hours ago',
            messages: [
                { id: 1, sender: 'user', content: 'Can you explain all three of Newton\'s laws with examples?', time: '11:00 AM' },
            ],
            tutor: { name: 'Prof. Rajesh Kumar', avatar: '👨‍🏫' }
        },
        {
            id: 3,
            title: 'What is the difference between DNA and RNA?',
            subject: 'Biology',
            status: 'resolved',
            type: 'ai',
            createdAt: '1 day ago',
            messages: [
                { id: 1, sender: 'user', content: 'What\'s the difference between DNA and RNA?', time: '3:00 PM' },
                { id: 2, sender: 'ai', content: 'Great question! Here are the key differences:\n\n1. **Structure**: DNA is double-stranded, RNA is single-stranded\n2. **Sugar**: DNA has deoxyribose, RNA has ribose\n3. **Bases**: DNA has Thymine, RNA has Uracil\n4. **Location**: DNA is in nucleus, RNA can be in cytoplasm', time: '3:00 PM' },
            ]
        },
        {
            id: 4,
            title: 'How to balance chemical equations?',
            subject: 'Chemistry',
            status: 'resolved',
            type: 'ai',
            createdAt: '2 days ago',
            messages: [
                { id: 1, sender: 'user', content: 'How do I balance chemical equations?', time: '4:00 PM' },
                { id: 2, sender: 'ai', content: 'Balancing chemical equations follows these steps:\n\n1. Write the unbalanced equation\n2. Count atoms on each side\n3. Add coefficients to balance\n4. Start with most complex molecule\n5. Leave single elements for last\n6. Verify the balance', time: '4:00 PM' },
            ]
        },
    ]

    const filteredDoubts = doubts.filter(doubt => {
        if (filter === 'all') return true
        if (filter === 'resolved') return doubt.status === 'resolved'
        if (filter === 'pending') return doubt.status === 'pending'
        if (filter === 'tutor') return doubt.type === 'tutor'
        if (filter === 'ai') return doubt.type === 'ai'
        return true
    })

    return (
        <div className="my-doubts-page">
            <div className="page-header">
                <h1 className="page-title">My Doubts</h1>
                <p className="page-subtitle">View and manage all your conversations</p>
            </div>

            {/* Filters */}
            <div className="doubts-filters">
                {['all', 'pending', 'resolved', 'tutor', 'ai'].map(f => (
                    <button
                        key={f}
                        className={`filter-btn ${filter === f ? 'active' : ''}`}
                        onClick={() => setFilter(f)}
                    >
                        {f === 'all' && '📋 All'}
                        {f === 'pending' && '⏳ Pending'}
                        {f === 'resolved' && '✅ Resolved'}
                        {f === 'tutor' && '👨‍🏫 Tutor'}
                        {f === 'ai' && '🤖 AI'}
                    </button>
                ))}
            </div>

            <div className="doubts-layout">
                {/* Doubts List */}
                <div className="doubts-list-container">
                    {filteredDoubts.length > 0 ? (
                        <div className="doubts-list">
                            {filteredDoubts.map(doubt => (
                                <div
                                    key={doubt.id}
                                    className={`doubt-card ${selectedDoubt?.id === doubt.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedDoubt(doubt)}
                                >
                                    <div className="doubt-card-header">
                                        <span className={`doubt-type ${doubt.type}`}>
                                            {doubt.type === 'ai' ? '🤖' : '👨‍🏫'}
                                        </span>
                                        <span className={`doubt-status-badge ${doubt.status}`}>
                                            {doubt.status}
                                        </span>
                                    </div>
                                    <h3 className="doubt-card-title">{doubt.title}</h3>
                                    <div className="doubt-card-meta">
                                        <span className="doubt-subject">{doubt.subject}</span>
                                        <span className="doubt-time">{doubt.createdAt}</span>
                                    </div>
                                    {doubt.messages.length > 0 && (
                                        <p className="doubt-preview">
                                            {doubt.messages[doubt.messages.length - 1].content.substring(0, 60)}...
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <span className="empty-icon">📭</span>
                            <h3>No doubts found</h3>
                            <p>Try changing the filter or ask a new question</p>
                        </div>
                    )}
                </div>

                {/* Conversation View */}
                <div className="conversation-container">
                    {selectedDoubt ? (
                        <>
                            <div className="conversation-header">
                                <div className="conversation-info">
                                    <h3>{selectedDoubt.title}</h3>
                                    <div className="conversation-meta">
                                        <span className="subject-tag">{selectedDoubt.subject}</span>
                                        <span className={`status-tag ${selectedDoubt.status}`}>{selectedDoubt.status}</span>
                                        {selectedDoubt.tutor && (
                                            <span className="tutor-tag">
                                                {selectedDoubt.tutor.avatar} {selectedDoubt.tutor.name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="conversation-messages">
                                {selectedDoubt.messages.map(msg => (
                                    <div key={msg.id} className={`conv-message ${msg.sender}`}>
                                        <div className="message-bubble">
                                            {msg.content.split('\n').map((line, i) => (
                                                <p key={i}>{line}</p>
                                            ))}
                                        </div>
                                        <span className="message-time">{msg.time}</span>
                                    </div>
                                ))}
                            </div>

                            {selectedDoubt.status === 'resolved' && (
                                <div className="conversation-footer">
                                    <div className="resolution-box">
                                        <span className="resolution-icon">✅</span>
                                        <p>This doubt has been resolved. Was this helpful?</p>
                                        <div className="rating-buttons">
                                            <button className="rating-btn">👍 Yes</button>
                                            <button className="rating-btn">👎 No</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedDoubt.status === 'pending' && (
                                <div className="conversation-input">
                                    <input type="text" placeholder="Type your follow-up message..." />
                                    <button className="btn btn-primary">Send</button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="no-selection">
                            <span className="no-selection-icon">
                                <img src="/assets/icons/chat.png" alt="Chat" width="64" height="64" style={{ opacity: 0.5 }} />
                            </span>
                            <h3>Select a conversation</h3>
                            <p>Click on a doubt to view the conversation</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MyDoubts
