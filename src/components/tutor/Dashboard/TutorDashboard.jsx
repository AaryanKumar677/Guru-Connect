/* ==============================
   Tutor Dashboard Component
   Main tutor dashboard with stats overview, pending requests,
   upcoming sessions, recent students, and quick action buttons
   ============================== */
import { useState, useEffect } from 'react'
import { useAuth } from '../../../App'
import './TutorDashboard.css'
import {
    generateTutorStats,
    generateUpcomingSessions,
    generatePendingRequests,
    generateRecentStudents,
    generateQuickActions
} from './TutorDashboardData'

// Components
import TutorDashboardHeader from './components/TutorDashboardHeader'
import TutorStatsOverview from './components/TutorStatsOverview'
import UpcomingSessions from './components/UpcomingSessions'
import PendingRequests from './components/PendingRequests'
import RecentStudents from './components/RecentStudents'
import QuickActions from './components/QuickActions'
import ProfileCompletionBanner from '../../common/ProfileCompletionBanner/ProfileCompletionBanner'

const TutorDashboard = () => {
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState(true)
    const [stats, setStats] = useState(null)
    const [sessions, setSessions] = useState([])
    const [requests, setRequests] = useState([])
    const [students, setStudents] = useState([])
    const [quickActions, setQuickActions] = useState([])

    useEffect(() => {
        // Simulate data loading with personalized content
        const loadDashboardData = async () => {
            setIsLoading(true)

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500))

            // Generate personalized data based on user
            setStats(generateTutorStats(user))
            setSessions(generateUpcomingSessions())
            setRequests(generatePendingRequests())
            setStudents(generateRecentStudents())
            setQuickActions(generateQuickActions())

            setIsLoading(false)
        }

        loadDashboardData()
    }, [user])

    if (isLoading) {
        return (
            <div className="dashboard-page tutor-dashboard">
                <div className="dashboard-container">
                    <div className="dashboard-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading your dashboard...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="dashboard-page tutor-dashboard">
            <div className="dashboard-container">
                {/* 1. Header with Dynamic CTA */}
                <TutorDashboardHeader user={user} sessions={sessions} requests={requests} />

                {/* Profile Completion Nudge */}
                <ProfileCompletionBanner />

                {/* 2. Stats Overview */}
                <TutorStatsOverview stats={stats} />

                {/* 3. Main Content Grid */}
                <div className="dashboard-main-grid">
                    <div className="dashboard-left-col">
                        <UpcomingSessions sessions={sessions} />
                        <PendingRequests requests={requests} />
                    </div>

                    <div className="dashboard-right-col">
                        <RecentStudents students={students} />
                        <QuickActions actions={quickActions} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TutorDashboard
