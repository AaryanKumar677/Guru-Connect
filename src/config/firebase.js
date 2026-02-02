// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDiybxlg05vIvuKIS93SXir-ciw4Gta_0o",
    authDomain: "guruconnect-427df.firebaseapp.com",
    projectId: "guruconnect-427df",
    storageBucket: "guruconnect-427df.firebasestorage.app",
    messagingSenderId: "159474111274",
    appId: "1:159474111274:web:52c4439b72825251390453",
    databaseURL: "https://guruconnect-427df-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);

export default app;
