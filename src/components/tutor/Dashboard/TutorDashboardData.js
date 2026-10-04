/* ==============================
   Tutor Dashboard Data - Static/Mock Data
   Contains mock data for tutor dashboard: earnings stats,
   pending requests, upcoming sessions, and recent student interactions
   ============================== */
// TutorDashboardData.js - Data generation functions for Tutor Dashboard

export const generateTutorStats = (user) => {
    return {
        earnings: {
            value: '₹4,500',
            label: 'Total Earnings',
            trend: 'up',
            delta: '+₹1,200 this week',
            icon: 'earnings'
        },
        sessions: {
            value: '45',
            label: 'Sessions Completed',
            trend: 'up',
            delta: '+8 this week',
            icon: 'sessions'
        },
        students: {
            value: '28',
            label: 'Active Students',
            trend: 'up',
            delta: '+3 new this week',
            icon: 'students'
        },
        rating: {
            value: '4.8',
            label: 'Average Rating',
            trend: 'up',
            delta: 'Based on 120 reviews',
            icon: 'rating'
        }
    };
};

export const generateUpcomingSessions = () => {
    return [
        {
            id: 1,
            student: 'Rahul Sharma',
            avatar: '👦',
            subject: 'Mathematics',
            topic: 'Calculus - Integration',
            time: 'Today, 4:00 PM',
            duration: '30 min',
            status: 'confirmed'
        },
        {
            id: 2,
            student: 'Priya Patel',
            avatar: '👧',
            subject: 'Physics',
            topic: 'Mechanics - Newton Laws',
            time: 'Today, 5:30 PM',
            duration: '45 min',
            status: 'confirmed'
        },
        {
            id: 3,
            student: 'Amit Kumar',
            avatar: '👦',
            subject: 'Mathematics',
            topic: 'Algebra - Quadratic Equations',
            time: 'Tomorrow, 2:00 PM',
            duration: '30 min',
            status: 'pending'
        }
    ];
};

export const generatePendingRequests = () => {
    return [
        {
            id: 1,
            student: 'Vikram Singh',
            avatar: '👨',
            subject: 'Calculus',
            time: 'Tomorrow, 3:00 PM',
            message: 'Need help with integration techniques',
            urgency: 'high'
        },
        {
            id: 2,
            student: 'Neha Sharma',
            avatar: '👩',
            subject: 'Algebra',
            time: 'Next Week',
            message: 'Preparing for final exams',
            urgency: 'medium'
        },
        {
            id: 3,
            student: 'Raj Patel',
            avatar: '👦',
            subject: 'Trigonometry',
            time: 'Flexible',
            message: 'Weekly tutoring sessions',
            urgency: 'low'
        }
    ];
};

export const generateRecentStudents = () => {
    return [
        {
            id: 1,
            name: 'Rahul Sharma',
            avatar: '👦',
            sessions: 12,
            lastSession: '2 hours ago',
            progress: 85
        },
        {
            id: 2,
            name: 'Priya Patel',
            avatar: '👧',
            sessions: 8,
            lastSession: 'Yesterday',
            progress: 72
        },
        {
            id: 3,
            name: 'Amit Kumar',
            avatar: '👦',
            sessions: 5,
            lastSession: '3 days ago',
            progress: 58
        },
        {
            id: 4,
            name: 'Sneha Gupta',
            avatar: '👧',
            sessions: 3,
            lastSession: '1 week ago',
            progress: 40
        }
    ];
};

export const generateQuickActions = () => {
    return [
        {
            id: 1,
            title: 'Manage Sessions',
            icon: '📅',
            link: '/tutor/sessions',
            color: 'blue'
        },
        {
            id: 2,
            title: 'Set Availability',
            icon: '⏰',
            link: '/tutor/profile',
            color: 'purple'
        },
        {
            id: 3,
            title: 'View Earnings',
            icon: 'earnings',
            link: '/tutor/earnings',
            color: 'green'
        },
        {
            id: 4,
            title: 'Update Profile',
            icon: '👤',
            link: '/tutor/profile',
            color: 'orange'
        }
    ];
};
