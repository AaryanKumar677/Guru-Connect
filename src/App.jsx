/* ==============================
   App Component - Root Application Component
   Manages global state (auth, theme, sidebar, toasts), defines all routes,
   provides context providers (Theme, Toast, Auth, Sidebar) to entire app
   ============================== */
import { useState, useEffect, createContext, useContext, lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { authService } from './services/authService'
import { auth, db } from './config/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import Header from './components/common/Header/Header'
import Footer from './components/common/Footer/Footer'
import Sidebar from './components/common/Sidebar/Sidebar'
import Toast from './components/common/Toast/Toast'

import Hero from './components/landing/Hero/Hero'
import Features from './components/landing/Features/Features'
import AIFeatures from './components/landing/AIFeatures/AIFeatures'
import Comparison from './components/landing/Comparison/Comparison'
import Facilities from './components/landing/Facilities/Facilities'
import AuthModal from './components/auth/AuthModal/AuthModal'

import StudentDashboard from './components/student/Dashboard/StudentDashboard'
import AIAssistant from './components/student/AIAssistant/AIAssistant'
import TutorMarketplace from './components/student/TutorMarketplace/TutorMarketplace'
import MyDoubts from './components/student/MyDoubts/MyDoubts'
import Subscription from './components/student/Subscription/Subscription'
import StudentProfile from './components/student/Profile/StudentProfile'
import StudentMessages from './components/student/Messages/Messages'

import TutorDashboard from './components/tutor/Dashboard/TutorDashboard'
import TutorProfile from './components/tutor/Profile/TutorProfile'
import Sessions from './components/tutor/Sessions/Sessions'
import Earnings from './components/tutor/Earnings/Earnings'
import Settings from './components/common/Settings/Settings'
import Help from './components/common/Help/Help'
import GlobalCallListener from './components/global/GlobalCallListener'
import NotFound from './components/common/NotFound/NotFound'

const TutorMessages = StudentMessages;

const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p>Loading...</p>
  </div>
)

import './index.css'
import './App.css'

export const ThemeContext = createContext()

export const useTheme = () => useContext(ThemeContext)

export const ToastContext = createContext()

export const useToast = () => useContext(ToastContext)

export const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const SidebarContext = createContext()

export const useSidebar = () => useContext(SidebarContext)

function App() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('guru-connect-theme')
    return saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  })

  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('login')

  const [toasts, setToasts] = useState([])

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('guru-connect-user')
    return saved ? JSON.parse(saved) : null
  })

  const [isAuthLoading, setIsAuthLoading] = useState(true)

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const [hasVisited, setHasVisited] = useState(() => {
    return localStorage.getItem('guru-connect-visited') === 'true'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('guru-connect-theme', theme)
  }, [theme])

  useEffect(() => {
    if (!hasVisited && !user && !isAuthLoading) {
      const timer = setTimeout(() => {
        setShowAuthModal(true)
        setAuthMode('signup')
        localStorage.setItem('guru-connect-visited', 'true')
        setHasVisited(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [hasVisited, user, isAuthLoading])

  useEffect(() => {
    let presenceUnsubscribe = null;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          console.log('[App] User authenticated:', firebaseUser.uid);

          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          if (userDoc.exists()) {
            const userData = { id: firebaseUser.uid, ...userDoc.data() }
            setUser(userData)
            localStorage.setItem('guru-connect-user', JSON.stringify(userData))

            console.log('[App] Setting up presence...');
            const { setupPresence } = await import('./services/firebaseService');
            presenceUnsubscribe = setupPresence(firebaseUser.uid);
          } else {
            const saved = localStorage.getItem('guru-connect-user')
            if (saved) {
              const parsed = JSON.parse(saved)
              if (parsed.id === firebaseUser.uid) {
                setUser(parsed)

                console.log('[App] Setting up presence (from localStorage)...');
                const { setupPresence } = await import('./services/firebaseService');
                presenceUnsubscribe = setupPresence(firebaseUser.uid);
              } else {
                setUser(null)
                localStorage.removeItem('guru-connect-user')
              }
            }
          }
        } else {
          console.log('[App] User signed out');
          setUser(null)
          localStorage.removeItem('guru-connect-user')

          if (presenceUnsubscribe) {
            presenceUnsubscribe();
            presenceUnsubscribe = null;
          }
        }
      } catch (error) {
        console.error("Auth state sync error:", error)
        setUser(null)
      } finally {
        setIsAuthLoading(false)
      }
    })

    return () => {
      unsubscribe();
      if (presenceUnsubscribe) {
        presenceUnsubscribe();
      }
    };
  }, [])


  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  const showToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
  }

  const dismissToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  const closeAuthModal = () => {
    setShowAuthModal(false)
  }

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('guru-connect-user', JSON.stringify(userData))
    closeAuthModal()
    showToast(`Welcome back, ${userData.name}!`, 'success')
  }

  const signup = (userData) => {
    setUser(userData)
    localStorage.setItem('guru-connect-user', JSON.stringify(userData))
    closeAuthModal()
    showToast('Account created successfully! Welcome to Guru Connect.', 'success')
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('guru-connect-user')
    showToast('You have been logged out.', 'info')
  }

  const location = useLocation()

  const updateUser = async (updates) => {
    try {
      const updated = await authService.updateUser(user.id, updates)
      setUser(updated)
    } catch (error) {
      console.error('Failed to update user:', error)
      showToast('Failed to save changes', 'error')
    }
  }

  const isDashboardRoute = user && (
    location.pathname.startsWith('/student') ||
    location.pathname.startsWith('/tutor')
  )

  if (isAuthLoading) {
    return <LoadingSpinner />
  }

  const isMessagesRoute = location.pathname.includes('/messages')

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ToastContext.Provider value={{ showToast, dismissToast }}>
        <SidebarContext.Provider value={{ sidebarCollapsed, toggleSidebar, mobileMenuOpen, toggleMobileMenu, closeMobileMenu }}>
          <AuthContext.Provider value={{ user, login, signup, logout, openAuthModal, updateUser }}>
            <div className={`app ${isDashboardRoute ? 'app-dashboard' : ''} ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
              <Header />

              <GlobalCallListener />

              {user && (
                <Routes>
                  <Route path="/student/*" element={<Sidebar role="student" />} />
                  <Route path="/tutor/*" element={<Sidebar role="tutor" />} />
                  <Route path="*" element={null} />
                </Routes>
              )}

              <main className={`main-content ${isDashboardRoute ? 'with-sidebar' : ''} ${sidebarCollapsed ? 'collapsed' : ''} ${isMessagesRoute ? 'messages-mode' : ''}`}>
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    <Route path="/" element={
                      user ? (
                        <Navigate to={user.role === 'tutor' ? '/tutor/dashboard' : '/student/dashboard'} replace />
                      ) : (
                        <>
                          <Hero />
                          <Features />
                          <AIFeatures />
                          <Comparison />
                          <Facilities />

                        </>
                      )
                    } />

                    <Route path="/student/dashboard" element={
                      user?.role === 'student' ? <StudentDashboard /> : <Navigate to="/" replace />
                    } />
                    <Route path="/student/ai-assistant" element={
                      user?.role === 'student' ? <AIAssistant /> : <Navigate to="/" replace />
                    } />
                    <Route path="/student/tutors" element={
                      user?.role === 'student' ? <TutorMarketplace /> : <Navigate to="/" replace />
                    } />
                    <Route path="/student/doubts" element={
                      user?.role === 'student' ? <MyDoubts /> : <Navigate to="/" replace />
                    } />
                    <Route path="/student/subscription" element={
                      user?.role === 'student' ? <Subscription /> : <Navigate to="/" replace />
                    } />
                    <Route path="/student/profile" element={
                      user?.role === 'student' ? <StudentProfile /> : <Navigate to="/" replace />
                    } />
                    <Route path="/student/messages" element={
                      user?.role === 'student' ? <StudentMessages /> : <Navigate to="/" replace />
                    } />

                    <Route path="/tutor/dashboard" element={
                      user?.role === 'tutor' ? <TutorDashboard /> : <Navigate to="/" replace />
                    } />
                    <Route path="/tutor/profile" element={
                      user?.role === 'tutor' ? <TutorProfile /> : <Navigate to="/" replace />
                    } />
                    <Route path="/tutor/sessions" element={
                      user?.role === 'tutor' ? <Sessions /> : <Navigate to="/" replace />
                    } />
                    <Route path="/tutor/earnings" element={
                      user?.role === 'tutor' ? <Earnings /> : <Navigate to="/" replace />
                    } />
                    <Route path="/tutor/settings" element={
                      user?.role === 'tutor' ? <Settings /> : <Navigate to="/" replace />
                    } />
                    <Route path="/tutor/messages" element={
                      user?.role === 'tutor' ? <TutorMessages /> : <Navigate to="/" replace />
                    } />

                    <Route path="/student/settings" element={
                      user?.role === 'student' ? <Settings /> : <Navigate to="/" replace />
                    } />

                    <Route path="/student/help" element={
                      user?.role === 'student' ? <Help /> : <Navigate to="/" replace />
                    } />
                    <Route path="/tutor/help" element={
                      user?.role === 'tutor' ? <Help /> : <Navigate to="/" replace />
                    } />

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </main>

              {!isDashboardRoute && <Footer />}

              <Suspense fallback={null}>
                <AuthModal
                  isOpen={showAuthModal}
                  onClose={closeAuthModal}
                  mode={authMode}
                  setMode={setAuthMode}
                />
              </Suspense>

              <div className="toast-container">
                {toasts.map(toast => (
                  <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onDismiss={() => dismissToast(toast.id)}
                  />
                ))}
              </div>
            </div>

          </AuthContext.Provider>
        </SidebarContext.Provider>
      </ToastContext.Provider>
    </ThemeContext.Provider>
  )
}

export default App
