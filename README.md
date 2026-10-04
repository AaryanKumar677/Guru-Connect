<div align="center">
  <img src="https://img.shields.io/badge/Guru-Connect-6366f1?style=for-the-badge&logo=react&logoColor=white" alt="Guru Connect Banner" height="60" />
  <h1>🎓 Guru Connect</h1>
  <p><strong>Empowering the Future of Education with AI-Driven Learning & Seamless Tutoring</strong></p>
  <h3>🌐 <a href="https://guruconnect.vercel.app/" target="_blank">GuruConnect</a></h3>

  <p>
    <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" /></a>
    <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" /></a>
    <a href="https://firebase.google.com/"><img src="https://img.shields.io/badge/Firebase-Auth%20%7C%20Firestore-FFCA28?style=flat-square&logo=firebase&logoColor=black" alt="Firebase" /></a>
    <a href="https://deepmind.google/technologies/gemini/"><img src="https://img.shields.io/badge/Gemini-AI%20Integration-8E75B2?style=flat-square&logo=googlebard&logoColor=white" alt="Gemini AI" /></a>
    <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="License" /></a>
  </p>
</div>

---

## 🌟 About The Project

**Guru Connect** is a next-generation Ed-Tech platform designed to bridge the gap between students and expert tutors. By integrating cutting-edge AI (Google Gemini) and a robust marketplace, Guru Connect provides a comprehensive ecosystem for learning, mentoring, and academic growth. 

Whether you are a student seeking instant AI assistance for a complex problem, or a tutor looking to monetize your expertise, Guru Connect offers a premium, lag-free, and beautifully crafted experience.

---

## ✨ Core Features

### 👨‍🎓 For Students
*   **🤖 Guru AI Assistant:** A specialized, conversational AI powered by Google Gemini to help you solve doubts, explain concepts, and generate study materials instantly.
*   **👨‍🏫 Tutor Marketplace:** Discover, filter, and book 1-on-1 sessions with verified expert tutors across various subjects.
*   **❓ My Doubts Repository:** A dedicated space to track, organize, and revisit all your asked questions and their solutions.
*   **💎 Subscription & Points:** Manage your learning plans, earn points, and unlock premium educational features seamlessly.
*   **📊 Personalized Dashboard:** Track your academic progress, upcoming sessions, and recent AI interactions in one unified view.

### 👩‍🏫 For Tutors
*   **📅 Session Management:** Accept, reschedule, and manage upcoming student sessions through an intuitive calendar-like interface.
*   **💰 Earnings & Analytics:** Track your income in real-time, view detailed performance analytics, and request secure withdrawals.
*   **👤 Professional Profile:** Showcase your qualifications, teaching style, availability, and reviews to attract more students.

### 🌐 Platform Wide
*   **🔐 Seamless Authentication:** Secure Login and Sign-Up flows with Email/Password, Google OAuth, and GitHub OAuth (Powered by Firebase).
*   **🎨 Premium UI/UX:** A stunning, fully responsive interface featuring Dark/Light mode, glassmorphism elements, and smooth micro-animations.
*   **⚡ High Performance:** Built with Vite for lightning-fast HMR and optimized production builds.

---

## 🛠️ Technology Stack

| Category | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18 |
| **Build Tool** | Vite |
| **Styling** | Vanilla CSS (Custom Design System, CSS Variables) |
| **Routing** | React Router DOM v6 |
| **Backend / BaaS** | Firebase (Authentication, Firestore Database) |
| **Artificial Intelligence**| Google Gemini API |
| **Icons** | Custom SVGs |

---

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites

Ensure you have the following installed:
*   [Node.js](https://nodejs.org/en/) (v18.0.0 or higher)
*   npm (usually comes with Node.js) or yarn

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/AaryanKumar677/Guru-Connect.git
   cd Guru-Connect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your API keys:
   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   
   # Gemini AI API Key (Get it from Google AI Studio)
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Start the Development Server**
   ```bash
   npm run dev
   ```
   > The application will be running at [http://localhost:5173](http://localhost:5173).

---

## 📁 Project Architecture

```text
src/
├── assets/             # Images, SVGs, and static assets
├── components/         
│   ├── auth/           # Login, Sign Up, Autocomplete & Modals
│   ├── common/         # Reusable UI (Header, Sidebar, Settings, Toasts)
│   ├── global/         # Global listeners and overlays
│   ├── landing/        # Sections for the public landing page
│   ├── student/        # Student-specific views (Dashboard, AI Assistant, etc.)
│   └── tutor/          # Tutor-specific views (Dashboard, Sessions, Earnings)
├── config/             # Firebase and external service configurations
├── contexts/           # React Context Providers (if any)
├── services/           # Business logic (authService, collegeService, geminiAPI)
├── styles/             # Additional global stylesheets
├── App.jsx             # Root component and Route definitions
├── App.css             # Main application layout styles
└── index.css           # Design system tokens (colors, typography, animations)
```

---

## 🎨 Design System Principles

Guru Connect does not rely on heavy CSS frameworks. Instead, it utilizes a highly scalable **Vanilla CSS Design System**:
*   **CSS Variables:** Extensive use of `--var` for themes (Dark/Light), typography, and spacing.
*   **Micro-Animations:** Thoughtful use of `@keyframes` to bring the interface to life without compromising performance.
*   **Glassmorphism:** Elegant frosted-glass effects to maintain a premium and modern aesthetic.

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>Made with ❤️ by the <b>Guru Connect Team</b></p>
  <p><i>Empowering learners, one session at a time.</i></p>
</div>
