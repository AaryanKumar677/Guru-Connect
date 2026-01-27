# 🎓 Guru Connect

An ed-tech platform connecting students with expert tutors and AI-powered learning assistance.

![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite)
![CSS](https://img.shields.io/badge/CSS-Custom%20Design%20System-1572B6?logo=css3)

## ✨ Features

### For Students
- 🤖 **AI Assistant** - Get instant help powered by Gemini AI
- 👨‍🏫 **Find Tutors** - Browse and book sessions with expert tutors
- ❓ **My Doubts** - Track all your questions and solutions
- 💎 **Subscription** - Manage your plans and points
- 📊 **Dashboard** - Track progress and achievements

### For Tutors
- 📅 **Sessions** - Manage incoming requests and scheduled sessions
- 💰 **Earnings** - Track income and request withdrawals
- 👤 **Profile** - Showcase expertise and availability
- 📈 **Analytics** - View performance metrics

### General
- 🌙 Dark/Light theme toggle
- 📱 Fully responsive design
- ⚡ Lazy loading for performance
- 🔐 Role-based authentication

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/guru-connect.git
cd guru-connect

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Environment Variables

Create a `.env` file in the root directory:

```env
# Gemini AI API Key (optional - demo mode works without it)
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Get your Gemini API key from: [Google AI Studio](https://makersuite.google.com/app/apikey)

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── common/         # Shared components (Header, Footer, Sidebar, etc.)
│   ├── landing/        # Landing page sections
│   ├── student/        # Student dashboard components
│   └── tutor/          # Tutor dashboard components
├── services/           # API services (Gemini integration)
├── App.jsx             # Main app with routing
├── App.css             # App-level styles
└── index.css           # Global styles & design system
```

## 🎨 Design System

The app uses a custom CSS design system with:
- CSS custom properties for theming
- Responsive typography scale
- Consistent spacing system
- Reusable component styles

## 📄 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🛠️ Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Vanilla CSS with custom design system
- **Routing**: React Router v6
- **State**: React Context API
- **AI**: Google Gemini API
- **Build**: Vite

## 📱 Pages Overview

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/student/dashboard` | Student home |
| `/student/ai-assistant` | AI chat interface |
| `/student/tutors` | Tutor marketplace |
| `/student/doubts` | My questions |
| `/student/subscription` | Plans & points |
| `/student/profile` | Student profile |
| `/student/settings` | App settings |
| `/student/help` | Help & FAQ |
| `/tutor/dashboard` | Tutor home |
| `/tutor/profile` | Tutor profile |
| `/tutor/sessions` | Session management |
| `/tutor/earnings` | Earnings & wallet |
| `/tutor/settings` | App settings |
| `/tutor/help` | Help & FAQ |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

---

Made with ❤️ by Guru Connect Team
