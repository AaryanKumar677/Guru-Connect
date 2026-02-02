import { useState, useEffect } from 'react'
import { useAuth } from '../../../App'
import './StudentDashboard.css'
import {
    generateStats,
    generateSessions,
    generateRecommendations,
    generateInsights,
    generateAchievements,
    generateNextActions
} from './DashboardData'

// Components
import DashboardHeader from './components/DashboardHeader'
import StatsOverview from './components/StatsOverview'
import ActionCenter from './components/ActionCenter'
import InsightsPanel from './components/InsightsPanel'
import SessionList from './components/SessionList'
import TutorRecommendations from './components/TutorRecommendations'
import AchievementsWidget from './components/AchievementsWidget'
import ProfileCompletionBanner from '../../common/ProfileCompletionBanner/ProfileCompletionBanner'

const StudentDashboard = () => {
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState(true)
    const [stats, setStats] = useState(null)
    const [sessions, setSessions] = useState([])
    const [nextActions, setNextActions] = useState([])
    const [insights, setInsights] = useState(null)
    const [tutors, setTutors] = useState([])
    const [achievements, setAchievements] = useState([])

    useEffect(() => {
        // Simulate data loading with personalized content
        const loadDashboardData = async () => {
            setIsLoading(true)

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500))

            // Generate personalized data based on user
            setStats(generateStats(user))
            setSessions(generateSessions(user))
            setTutors(generateRecommendations())
            setInsights(generateInsights())
            setAchievements(generateAchievements(user))
            setNextActions(generateNextActions())

            setIsLoading(false)
        }

        loadDashboardData()
    }, [user])

    if (isLoading) {
        return (
            <div className="dashboard-page student-dashboard">
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
        <div className="dashboard-page student-dashboard">
            <div className="dashboard-container">
                {/* 1. Header with Dynamic CTA */}
                <DashboardHeader user={user} sessions={sessions} nextActions={nextActions} />

                {/* Profile Completion Nudge */}
                <ProfileCompletionBanner />

                {/* 2. Stats Overview */}
                <StatsOverview stats={stats} />

                {/* 3. Main Content Grid */}
                <div className="dashboard-main-grid">
                    <div className="dashboard-left-col">
                        <ActionCenter actions={nextActions} />
                        <SessionList sessions={sessions} />
                    </div>

                    <div className="dashboard-right-col">
                        <InsightsPanel insights={insights} />
                        <AchievementsWidget achievements={achievements} />
                    </div>
                </div>

                {/* 4. Tutor Recommendations (Full Width) */}
                <TutorRecommendations tutors={tutors} />
            </div>
        </div>
    )
}

export default StudentDashboard
