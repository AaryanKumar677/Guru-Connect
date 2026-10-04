/* ==============================
   Dashboard Skeleton Loader Component
   Loading placeholder for student dashboard with skeleton cards,
   shimmer animations for stats, sessions, and recommendation areas
   ============================== */
import React from 'react'
import Skeleton from '../../common/Skeleton/Skeleton'
import './DashboardSkeleton.css'

const DashboardSkeleton = () => {
    return (
        <div className="dashboard-skeleton">
            {/* Header Skeleton */}
            <div className="skeleton-header">
                <div className="skeleton-welcome">
                    <Skeleton variant="text" width="60%" height="32px" style={{ marginBottom: '12px' }} />
                    <Skeleton variant="text" width="40%" height="20px" />
                </div>
                <div className="skeleton-action">
                    <Skeleton variant="rectangular" width="120px" height="40px" />
                </div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="skeleton-stats-grid">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="skeleton-stat-card">
                        <Skeleton variant="circular" width="48px" height="48px" style={{ marginBottom: '16px' }} />
                        <Skeleton variant="text" width="50%" height="24px" style={{ marginBottom: '8px' }} />
                        <Skeleton variant="text" width="30%" height="16px" />
                    </div>
                ))}
            </div>

            {/* Main Content Grid Skeleton */}
            <div className="skeleton-main-grid">
                {/* Left Col */}
                <div className="skeleton-left-col">
                    <div className="skeleton-section">
                        <Skeleton variant="text" width="150px" height="24px" style={{ marginBottom: '20px' }} />
                        <div className="skeleton-action-cards">
                            <Skeleton variant="rectangular" height="100px" style={{ flex: 1 }} />
                            <Skeleton variant="rectangular" height="100px" style={{ flex: 1 }} />
                        </div>
                    </div>
                    <div className="skeleton-section">
                        <Skeleton variant="text" width="180px" height="24px" style={{ marginBottom: '20px' }} />
                        <Skeleton variant="rectangular" height="200px" />
                    </div>
                </div>

                {/* Right Col */}
                <div className="skeleton-right-col">
                    <Skeleton variant="rectangular" height="300px" style={{ marginBottom: '24px' }} />
                    <Skeleton variant="rectangular" height="200px" />
                </div>
            </div>
        </div>
    )
}

export default DashboardSkeleton
