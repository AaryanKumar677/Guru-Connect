import { useState, useEffect, createContext, useContext, lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { authService } from './services/authService'
import { auth, db } from './config/firebase' // Import auth directly
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import Header from './components/common/Header/Header'
import Footer from './components/common/Footer/Footer'
import Sidebar from './components/common/Sidebar/Sidebar'
import Toast from './components/common/Toast/Toast'

// ... (Lazy loads remain the same) ...
const Hero = lazy(() => import('./components/landing/Hero/Hero'))
const Features = lazy(() => import('./components/landing/Features/Features'))
const AIFeatures = lazy(() => import('./components/landing/AIFeatures/AIFeatures'))
const Comparison = lazy(() => import('./components/landing/Comparison/Comparison'))
const Facilities = lazy(() => import('./components/landing/Facilities/Facilities'))

const AuthModal = lazy(() => import('./components/auth/AuthModal/AuthModal'))

// Lazy load Student Components
const StudentDashboard = lazy(() => import('./components/student/Dashboard/StudentDashboard'))
const AIAssistant = lazy(() => import('./components/student/AIAssistant/AIAssistant'))
const TutorMarketplace = lazy(() => import('./components/student/TutorMarketplace/TutorMarketplace'))
const MyDoubts = lazy(() => import('./components/student/MyDoubts/MyDoubts'))
const Subscription = lazy(() => import('./components/student/Subscription/Subscription'))
const StudentProfile = lazy(() => import('./components/student/Profile/StudentProfile'))
const StudentMessages = lazy(() => import('./components/student/Messages/Messages'))

// Lazy load Tutor Components
const TutorDashboard = lazy(() => import('./components/tutor/Dashboard/TutorDashboard'))
const TutorProfile = lazy(() => import('./components/tutor/Profile/TutorProfile'))
const Sessions = lazy(() => import('./components/tutor/Sessions/Sessions'))
const Earnings = lazy(() => import('./components/tutor/Earnings/Earnings'))
const TutorMessages = lazy(() => import('./components/student/Messages/Messages')) // Reuse Messages component

// Lazy load Shared Components
const NotFound = lazy(() => import('./components/common/NotFound/NotFound'))
const Settings = lazy(() => import('./components/common/Settings/Settings'))
const Help = lazy(() => import('./components/common/Help/Help'))

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p>Loading...</p>
  </div>
)

import './index.css'
import './App.css'

// Theme Context
export const ThemeContext = createContext()

export const useTheme = () => useContext(ThemeContext)

// Toast Context
export const ToastContext = createContext()

export const useToast = () => useContext(ToastContext)

// Auth Context
export const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

// Sidebar Context
export const SidebarContext = createContext()

export const useSidebar = () => useContext(SidebarContext)

function App() {
  // Theme state
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('guru-connect-theme')
    return saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  })

  // Auth modal state
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('login')

  // Toast state
  const [toasts, setToasts] = useState([])

  // User state
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('guru-connect-user')
    return saved ? JSON.parse(saved) : null
  })

  // Auth Loading State
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  // Sidebar collapsed state (global)
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

  // First visit detection
  const [hasVisited, setHasVisited] = useState(() => {
    return localStorage.getItem('guru-connect-visited') === 'true'
  })

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('guru-connect-theme', theme)
  }, [theme])

  // Show auth modal on first visit
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

  // LISTEN INITIAL AUTH STATE
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // User is signed in, sync with Firestore to get role/name
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          if (userDoc.exists()) {
            const userData = { id: firebaseUser.uid, ...userDoc.data() }
            setUser(userData)
            localStorage.setItem('guru-connect-user', JSON.stringify(userData))
          } else {
            // If user authenticated but no firestore doc, try localStorage or clear
            // This prevents "stuck" loading if FS fails but Auth succeeds
            const saved = localStorage.getItem('guru-connect-user')
            if (saved) {
              // Verify ID matches
              const parsed = JSON.parse(saved)
              if (parsed.id === firebaseUser.uid) {
                setUser(parsed)
              } else {
                setUser(null)
                localStorage.removeItem('guru-connect-user')
              }
            }
          }
        } else {
          // User is signed out
          setUser(null)
          localStorage.removeItem('guru-connect-user')
        }
      } catch (error) {
        console.error("Auth state sync error:", error)
        // Ensure we don't get stuck in loading state on error
        setUser(null)
      } finally {
        setIsAuthLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])


  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  // Toast functions
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

  // Auth functions
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
      // localStorage update is handled by authService
    } catch (error) {
      console.error('Failed to update user:', error)
      showToast('Failed to save changes', 'error')
    }
  }

  const isDashboardRoute = user && (
    location.pathname.startsWith('/student') ||
    location.pathname.startsWith('/tutor')
  )

  // Show loading spinner while checking auth state
  if (isAuthLoading) {
    return <LoadingSpinner />
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ToastContext.Provider value={{ showToast, dismissToast }}>
        <SidebarContext.Provider value={{ sidebarCollapsed, toggleSidebar, mobileMenuOpen, toggleMobileMenu, closeMobileMenu }}>
          <AuthContext.Provider value={{ user, login, signup, logout, openAuthModal, updateUser }}>
            <div className={`app ${isDashboardRoute ? 'app-dashboard' : ''} ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
              <Header />

              {/* Sidebar for dashboard routes */}
              {user && (
                <Routes>
                  <Route path="/student/*" element={<Sidebar role="student" />} />
                  <Route path="/tutor/*" element={<Sidebar role="tutor" />} />
                  <Route path="*" element={null} />
                </Routes>
              )}

              <main className={`main-content ${isDashboardRoute ? 'with-sidebar' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`}>
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    {/* Landing Page */}
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

                    {/* Student Routes */}
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

                    {/* Tutor Routes */}
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

                    {/* Student Settings */}
                    <Route path="/student/settings" element={
                      user?.role === 'student' ? <Settings /> : <Navigate to="/" replace />
                    } />

                    {/* Help Pages */}
                    <Route path="/student/help" element={
                      user?.role === 'student' ? <Help /> : <Navigate to="/" replace />
                    } />
                    <Route path="/tutor/help" element={
                      user?.role === 'tutor' ? <Help /> : <Navigate to="/" replace />
                    } />

                    {/* 404 Page */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </main>

              {!isDashboardRoute && <Footer />}

              {/* Auth Modal */}
              <Suspense fallback={null}>
                <AuthModal
                  isOpen={showAuthModal}
                  onClose={closeAuthModal}
                  mode={authMode}
                  setMode={setAuthMode}
                />
              </Suspense>

              {/* Toasts */}
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
