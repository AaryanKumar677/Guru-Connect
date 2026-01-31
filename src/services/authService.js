
const DB_KEY = 'guru-connect-db';
const USER_KEY = 'guru-connect-user'; // Session key

// Helper to simulate delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getDB = () => {
    const db = localStorage.getItem(DB_KEY);
    return db ? JSON.parse(db) : { users: [] };
};

const saveDB = (db) => {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
};

export const authService = {
    // Signup: Create new user if email doesn't exist
    signup: async (userData) => {
        await delay(800); // Simulate network delay
        const db = getDB();

        if (db.users.find(u => u.email === userData.email)) {
            throw new Error('User already exists with this email');
        }

        const newUser = {
            ...userData,
            name: userData.fullName || userData.name,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
        };

        db.users.push(newUser);
        saveDB(db);

        return newUser;
    },

    // Login: Verify credentials (mock) and return user
    login: async (email, password) => {
        await delay(800);
        const db = getDB();
        const user = db.users.find(u => u.email === email);

        if (!user) {
            throw new Error('User not found');
        }

        // In a real app, we'd check hashed password. 
        // Here we just check if password exists in the mock check.
        // For simple mock, we trust the "password" field if we were storing it, 
        // but to keep it simple we just return the user if found.
        if (user.password !== password) {
            throw new Error('Invalid password');
        }

        return user;
    },

    // Update User: Find user by email and update fields
    updateUser: async (email, updates) => {
        await delay(500);
        const db = getDB();
        const userIndex = db.users.findIndex(u => u.email === email);

        if (userIndex === -1) {
            throw new Error('User not found');
        }

        const updatedUser = { ...db.users[userIndex], ...updates };
        db.users[userIndex] = updatedUser;
        saveDB(db);

        // Also update current session if it matches
        const sessionUser = JSON.parse(localStorage.getItem(USER_KEY) || '{}');
        if (sessionUser && sessionUser.email === email) {
            localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
        }

        return updatedUser;
    },

    // Get current user details/refresh
    getUser: async (email) => {
        const db = getDB();
        return db.users.find(u => u.email === email) || null;
    }
};
