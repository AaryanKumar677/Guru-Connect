// Dashboard data generator - creates personalized data based on user context

/**
 * Generate personalized stats based on user
 */
export const generateStats = (user) => {
    const daysSinceJoin = user?.createdAt
        ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
        : 7;

    return {
        points: {
            value: Math.min(daysSinceJoin * 100 + 250, 5000),
            delta: 50,
            trend: 'up',
            label: 'Total Points'
        },
        doubts: {
            value: Math.min(daysSinceJoin * 2, 50),
            delta: 3,
            trend: 'up',
            label: 'Doubts Resolved'
        },
        sessions: {
            value: Math.min(Math.floor(daysSinceJoin / 3), 20),
            delta: 1,
            trend: 'neutral',
            label: 'Sessions Completed'
        },
        streak: {
            value: Math.min(daysSinceJoin, 30),
            delta: 1,
            trend: 'up',
            label: 'Day Streak'
        }
    };
};

/**
 * Generate upcoming sessions based on user subjects
 */
export const generateSessions = (user) => {
    const subjects = ['Physics', 'Mathematics', 'Chemistry', 'Computer Science', 'English'];
    const tutors = [
        { name: 'Dr. Priya Sharma', avatar: '👩‍🏫' },
        { name: 'Mr. Alex Cohen', avatar: '👨‍🏫' },
        { name: 'Ms. Sarah Jenkins', avatar: '👩‍💼' },
        { name: 'Prof. Rajesh Kumar', avatar: '🧑‍🏫' }
    ];

    const sessions = [];
    const today = new Date();

    for (let i = 0; i < 3; i++) {
        const tutor = tutors[i % tutors.length];
        const subject = subjects[i % subjects.length];
        const sessionDate = new Date(today);
        sessionDate.setHours(today.getHours() + (i * 6) + 2);

        sessions.push({
            id: i + 1,
            tutorName: tutor.name,
            subject: subject,
            topic: `${subject} - Advanced Concepts`,
            time: formatSessionTime(sessionDate),
            status: 'upcoming',
            joinUrl: `/session/${100 + i}`,
            avatar: tutor.avatar
        });
    }

    return sessions;
};

/**
 * Generate tutor recommendations
 */
export const generateRecommendations = () => {
    return [
        {
            id: 101,
            name: 'Prof. Anjali Gupta',
            subject: 'Chemistry',
            rating: 4.9,
            reviews: 128,
            avatar: '👩‍🔬',
            hourlyRate: 15,
            nextAvailable: 'Today, 6:00 PM'
        },
        {
            id: 102,
            name: 'Mr. David Kim',
            subject: 'Computer Science',
            rating: 4.8,
            reviews: 85,
            avatar: '🧑‍💻',
            hourlyRate: 20,
            nextAvailable: 'Tomorrow, 9:00 AM'
        },
        {
            id: 103,
            name: 'Ms. Sarah Jenkins',
            subject: 'English Literature',
            rating: 4.95,
            reviews: 210,
            avatar: '👩‍🏫',
            hourlyRate: 12,
            nextAvailable: 'Today, 8:00 PM'
        },
        {
            id: 104,
            name: 'Dr. Ramesh Patel',
            subject: 'Mathematics',
            rating: 4.85,
            reviews: 156,
            avatar: '🧑‍🏫',
            hourlyRate: 18,
            nextAvailable: 'Tomorrow, 2:00 PM'
        }
    ];
};

/**
 * Generate insights based on user progress
 */
export const generateInsights = () => {
    return {
        weakAreas: [
            { subject: 'Physics', topic: 'Thermodynamics', score: 65 },
            { subject: 'Math', topic: 'Integration', score: 72 }
        ],
        strongAreas: [
            { subject: 'Chemistry', topic: 'Organic', score: 92 }
        ],
        learningProgress: 78
    };
};

/**
 * Generate achievements
 */
export const generateAchievements = (user) => {
    const daysSinceJoin = user?.createdAt
        ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
        : 7;

    return [
        { id: 1, title: 'Early Bird', icon: '🌅', unlocked: true },
        { id: 2, title: 'Problem Solver', icon: '🧩', unlocked: daysSinceJoin > 3 },
        { id: 3, title: 'Session Master', icon: '🎓', unlocked: daysSinceJoin > 7 },
        { id: 4, title: 'Streak Legend', icon: '🔥', unlocked: daysSinceJoin > 14 }
    ];
};

/**
 * Generate next actions/tasks
 */
export const generateNextActions = () => {
    return [
        {
            id: 1,
            type: 'assignment',
            title: 'Complete Thermodynamics Quiz',
            due: 'Today, 11:59 PM',
            priority: 'high',
            link: '/quiz/thermo'
        },
        {
            id: 2,
            type: 'doubt',
            title: 'Review solution for "Kinematics"',
            due: '2 hours ago',
            priority: 'medium',
            link: '/doubts/45'
        },
        {
            id: 3,
            type: 'session',
            title: 'Prepare for tomorrow\'s Physics session',
            due: 'Tomorrow, 10:00 AM',
            priority: 'low',
            link: '/sessions'
        }
    ];
};

// Helper function to format session time
function formatSessionTime(date) {
    const now = new Date();
    const diffHours = Math.floor((date - now) / (1000 * 60 * 60));

    if (diffHours < 24) {
        return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    } else if (diffHours < 48) {
        return `Tomorrow, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    } else {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    }
}

// Legacy exports for backward compatibility (will be removed)
export const mockStats = generateStats({});
export const mockSessions = generateSessions({});
export const mockRecommendations = generateRecommendations();
export const mockInsights = generateInsights();
export const mockAchievements = generateAchievements({});
export const mockNextActions = generateNextActions();
